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
        const data = await Vue.db.all('SELECT * FROM transaction_methods ORDER BY sort_order');
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        await Vue.db.run(`INSERT INTO transaction_methods (
          name, number_required, note, sort_order
        ) VALUES ($name, $number_required,
          $note, (select ifnull(max(sort_order), 0) + 1 from distribution_classes))
        `, {
          $name: data.name,
          $number_required: data.number_required,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error insert transaction_methods', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE transaction_methods SET
          name = $name, 
          number_required = $number_required,
          note = $note
          WHERE id = $id
        `, {
          $id: data.id,
          $name: data.name,
          $number_required: data.number_required,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error update transaction_methods', err);
        result = false;
      }
      return result;
    },

    async archiveItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE transaction_methods SET is_inactive = 1 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error archive transaction_methods', err);
        result = false;
      }
      return result;
    },

    async activateItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE transaction_methods SET is_inactive = 0 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error archive transaction_methods', err);
        result = false;
      }
      return result;
    },

    async deleteItem(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM transaction_methods WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE transaction_methods', err);
        result = false;
      }
      return result;
    },

    async setSortOrder(context, { id, sortOrder }) {
      let result;
      try {
        await Vue.db.run(`UPDATE transaction_methods SET
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
        FROM transactions where transaction_method_id = ?`, [id]);
        return result.cnt > 0;
      } catch (err) {
        console.log('error check assoc for transaction_method', err);
        return null;
      }
    },
  },
};
