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
        const data = await Vue.db.all(`SELECT causes.*, 
        contacts.company_name as contact_company_name, 
        contacts.first_name || ' ' || contacts.last_name as contact_name,
        cause_groups.sort_order
        FROM causes join contacts ON causes.contact_id = contacts.id
        join cause_groups ON causes.cause_group_id = cause_groups.id
        ORDER BY cause_groups.sort_order, causes.sort_order`);
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        await Vue.db.run(`INSERT INTO causes (
          cause_group_id, contact_id, distribution_class_id, name, note, sort_order
        ) VALUES ($cause_group_id, $contact_id, $distribution_class_id, 
          $name, $note, (select ifnull(max(sort_order), 0) + 1 from cause_groups))
        `, {
          $cause_group_id: data.cause_group_id,
          $contact_id: data.contact_id,
          $distribution_class_id: data.distribution_class_id,
          $name: data.name,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error insert cause_groups', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE causes SET
          cause_group_id = $cause_group_id,
          contact_id = $contact_id,
          distribution_class_id = $distribution_class_id,
          name = $name, 
          note = $note
          WHERE id = $id
        `, {
          $id: data.id,
          $cause_group_id: data.cause_group_id,
          $contact_id: data.contact_id,
          $distribution_class_id: data.distribution_class_id,
          $name: data.name,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error update causes', err);
        result = false;
      }
      return result;
    },

    async deleteItem(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM causes WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE causes', err);
        result = false;
      }
      return result;
    },

    async setSortOrder(context, { id, sortOrder }) {
      let result;
      try {
        await Vue.db.run(`UPDATE causes SET
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
        console.log('error update sort_order of causes', err);
        result = false;
      }
      return result;
    },
  },
};
