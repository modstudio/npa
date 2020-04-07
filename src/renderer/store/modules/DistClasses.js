import Vue from 'vue';

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
        const metricSubquery = `
          SELECT distribution_class_id, sum(amount) as sum
          FROM transactions JOIN categories ON transactions.category_id = categories.id
          WHERE distribution_class_id IS NOT NULL and transaction_type_id = 2
          GROUP by distribution_class_id
        `;
        const data = await Vue.db.all(`
          SELECT *, metrics.sum FROM distribution_classes 
          LEFT JOIN (${metricSubquery}) metrics
            ON distribution_classes.id = metrics.distribution_class_id
          ORDER BY sort_order
        `);
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        await Vue.db.run(`INSERT INTO distribution_classes (
          name, note, sort_order
        ) VALUES ($name, $note, (select ifnull(max(sort_order), 0) + 1 from distribution_classes))
        `, {
          $name: data.name,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error insert distribution_classes', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE distribution_classes SET
          name = $name, 
          note = $note
          WHERE id = $id
        `, {
          $id: data.id,
          $name: data.name,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error update distribution classses', err);
        result = false;
      }
      return result;
    },

    async archiveItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE distribution_classes SET is_inactive = 1 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error archive distribution_classes', err);
        result = false;
      }
      return result;
    },

    async activateItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE distribution_classes SET is_inactive = 0 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error activate distribution_classes', err);
        result = false;
      }
      return result;
    },

    async deleteItem(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM distribution_classes WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE distribution_classes', err);
        result = false;
      }
      return result;
    },

    async setSortOrder(context, { id, sortOrder }) {
      let result;
      try {
        await Vue.db.run(`UPDATE distribution_classes SET
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
        console.log('error update sort_order of distribution classses', err);
        result = false;
      }
      return result;
    },

    async checkAssociation(context, id) {
      try {
        const result = await Vue.db.get(`SELECT count(*) as cnt
        FROM categories where distribution_class_id = ?`, [id]);
        return result.cnt > 0;
      } catch (err) {
        console.log('error check assoc for distribution_classes', err);
        return null;
      }
    },
  },
};
