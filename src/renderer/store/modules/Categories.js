import Vue from 'vue';
import { categoryName, relatedCategoryName, categorySubText } from './queryHelpers/categoryQueryHelpers';

const causeId = 1;
const pledgeId = 2;
const loanId = 3;
const pikadonId = 4;

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    startingBalanceData: [],
    data: [],
  },
  // -----------------------------------------------------------------
  getters: {
    getItem: state => id => _.find(state.data, { id }),
    startingBalanceData: state => state.startingBalanceData,
    data: state => state.data,
    getCauses: state => state.data.filter(item => item.category_type_id === causeId),
    getPledges: state => state.data.filter(item => item.category_type_id === pledgeId),
    getLoans: state => state.data.filter(item => item.category_type_id === loanId),
    getPikadons: state => state.data.filter(item => item.category_type_id === pikadonId),
    category: state => categoryId => _.find(state.data, { id: categoryId }),
  },
  // -----------------------------------------------------------------
  mutations: {
    setStartingBalanceData(state, data) {
      state.startingBalanceData = data;
    },
    setData(state, data) {
      state.data = data;
    },
    updateItem(state, data) {
      const index = state.data.findIndex(item => item.id === data.id);
      if (index !== -1) {
        state.data.splice(index, 1, { ...data });
      }
    },
  },
  // -----------------------------------------------------------------
  actions: {
    getStartingBalanceCategories(context, transactionId = 0) {
      const where = `
        not EXISTS (select * from transactions where transaction_type_id = 10
        AND category_id = categories.id
        AND id <> ${transactionId} )
      `;
      context.dispatch('getData', { mutationName: 'setStartingBalanceData', where });
    },

    async getData(context, payload = { mutationName: 'setData', where: '1 = 1' }) {
      const { mutationName, where } = payload;
      try {
        const metricSubquery = `
        SELECT category_id, 
        sum(case when amount < 0 and transaction_type_id <> 2 THEN amount ELSE 0 END) as debit,
        sum(case when amount > 0 and transaction_type_id <> 2 THEN amount ELSE 0 END) as kredit,
        sum(case when transaction_type_id = 2 THEN amount ELSE 0 END) as distributed
        FROM transactions
        GROUP BY category_id        
        `;
        const categoryQuery = `SELECT categories.*,
        category_types.name as category_type_name,
        ${categoryName} as category_name,
        ${relatedCategoryName} as related_category_name,        
        ${categorySubText} as category_subtext,
        category_contact.company_name as contact_company_name, 
        category_contact.first_name as contact_first_name,
        category_contact.last_name as contact_last_name,
        category_groups.sort_order as group_sort_order,
        metrics.debit as metric_debit,
        metrics.kredit as metric_kredit,
        metrics.distributed as metric_distributed,
        metrics.debit + metrics.kredit + metrics.distributed as metric_balance
        FROM categories
        JOIN category_types ON categories.category_type_id = category_types.id
        JOIN contacts category_contact ON categories.contact_id = category_contact.id
        LEFT JOIN category_groups ON categories.category_group_id = category_groups.id
        LEFT JOIN categories related_category 
        ON categories.related_category_id = related_category.id
        LEFT JOIN contacts related_category_contact
          ON related_category.contact_id = related_category_contact.id
        LEFT JOIN (${metricSubquery}) metrics
          ON categories.id = metrics.category_id     
        where ${where} 
        ORDER BY categories.category_type_id,
          category_groups.sort_order, categories.sort_order, 
          case 
            when category_contact.company_name <> '' then category_contact.company_name
            else category_contact.first_name || ' ' || category_contact.last_name
          end
        `;
        const data = await Vue.db.all(categoryQuery);
        context.commit(mutationName, data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        const stm = await Vue.db.run(`INSERT INTO categories (
          category_type_id,  category_group_id, contact_id, related_category_id, 
          distribution_class_id,
          description, note,
          sort_order
        ) VALUES ($category_type_id, $category_group_id, $contact_id, $related_category_id, 
          $distribution_class_id,
          $description, $note,
          case
            when $category_type_id = 1 then
              (select ifnull(max(sort_order), 0) + 1 from categories 
                WHERE category_type_id = $category_type_id)
            else 0
          end)
        `, {
          $category_type_id: data.category_type_id,
          $contact_id: data.contact_id,
          $category_group_id: data.category_group_id,
          $related_category_id: data.related_category_id,
          $distribution_class_id: data.distribution_class_id,
          $description: data.description,
          $note: data.note,
        });
        result = stm.lastID;
      } catch (err) {
        console.log('error insert loans', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE categories SET
          contact_id = $contact_id,
          category_group_id = $category_group_id,
          related_category_id = $related_category_id,
          distribution_class_id = $distribution_class_id,
          description = $description,
          note = $note
          WHERE id = $id
        `, {
          $id: data.id,
          $contact_id: data.contact_id,
          $category_group_id: data.category_group_id,
          $related_category_id: data.related_category_id,
          $distribution_class_id: data.distribution_class_id,
          $description: data.description,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error update loans', err);
        result = false;
      }
      return result;
    },

    async archiveItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE categories SET is_inactive = 1 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error archive category', err);
        result = false;
      }
      return result;
    },

    async activateItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE categories SET is_inactive = 0 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error activate category', err);
        result = false;
      }
      return result;
    },

    async deleteItem(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM categories WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE pikadons', err);
        result = false;
      }
      return result;
    },

    async setSortOrder(context, { id, sortOrder }) {
      let result;
      try {
        await Vue.db.run(`UPDATE categories SET
          sort_order = $sortOrder
          WHERE id = $id
        `, {
          $id: id,
          $sortOrder: sortOrder,
        });
        result = true;
        const item = context.getters.getItem(id);
        context.commit('updateItem', { ...item, sort_order: sortOrder });
      } catch (err) {
        console.log('error update sort_order of categories', err);
        result = false;
      }
      return result;
    },

    async checkAssociation(context, id) {
      try {
        let result = await Vue.db.get(`SELECT count(*) as cnt
          FROM transactions where category_id = ?`, [id]);
        if (result.cnt > 0) {
          return true;
        }
        result = await Vue.db.get(`SELECT count(*) as cnt
          FROM categories where related_category_id = ?`, [id]);
        return result.cnt > 0;
      } catch (err) {
        console.log('error check assoc for transaction_method', err);
        return null;
      }
    },
  },
};
