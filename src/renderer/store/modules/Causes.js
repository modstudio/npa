import Vue from 'vue';

const categoryTypeId = 1;

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    data: [],
  },
  // -----------------------------------------------------------------
  getters: {
    data: state => state.data,
    getItem: state => id => _.find(state.data, { id }),
  },
  // -----------------------------------------------------------------
  mutations: {
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
    async getData(context) {
      try {
        const data = await Vue.db.all(`SELECT categories.*, 
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        category_groups.sort_order
        FROM categories join contacts ON categories.contact_id = contacts.id
        join category_groups ON categories.category_group_id = category_groups.id
        WHERE categories.category_type_id = $category_type_id
        ORDER BY category_groups.sort_order, categories.sort_order`, {
          $category_type_id: categoryTypeId,
        });
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        await Vue.db.run(`INSERT INTO categories (category_type_id,
          category_group_id, contact_id, distribution_class_id, name, note, sort_order
        ) VALUES ($category_type_id, $category_group_id, $contact_id, $distribution_class_id, 
          $name, $note, (select ifnull(max(sort_order), 0) + 1 from categories 
            WHERE category_type_id = $category_type_id))
        `, {
          $category_type_id: categoryTypeId,
          $category_group_id: data.category_group_id,
          $contact_id: data.contact_id,
          $distribution_class_id: data.distribution_class_id,
          $name: data.name,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error insert categories', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE categories SET
          category_group_id = $category_group_id,
          contact_id = $contact_id,
          distribution_class_id = $distribution_class_id,
          name = $name, 
          note = $note
          WHERE id = $id
        `, {
          $id: data.id,
          $category_group_id: data.category_group_id,
          $contact_id: data.contact_id,
          $distribution_class_id: data.distribution_class_id,
          $name: data.name,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error update categories', err);
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
        console.log('error DELETE categories', err);
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
  },
};
