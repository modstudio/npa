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
        const data = await Vue.db.all(`SELECT pledges.*,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name,
        causes.name as cause_name
        FROM pledges JOIN contacts ON pledges.contact_id = contacts.id
        JOIN causes ON pledges.cause_id = causes.id
        ORDER BY sort_order`);
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        await Vue.db.run(`INSERT INTO pledges (
          contact_id, cause_id, note, sort_order
        ) VALUES ($contact_id, $cause_id, $note, (select ifnull(max(sort_order), 0) + 1 from distribution_classes))
        `, {
          $contact_id: data.contact_id,
          $cause_id: data.cause_id,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error insert pledges', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE pledges SET
          contact_id = $contact_id,
          cause_id = $cause_id, 
          note = $note
          WHERE id = $id
        `, {
          $id: data.id,
          $contact_id: data.contact_id,
          $cause_id: data.cause_id,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error update pledges', err);
        result = false;
      }
      return result;
    },

    async deleteItem(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM pledges WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE pledges', err);
        result = false;
      }
      return result;
    },

    async setSortOrder(context, { id, sortOrder }) {
      let result;
      try {
        await Vue.db.run(`UPDATE pledges SET
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
        console.log('error update sort_order of pledges', err);
        result = false;
      }
      return result;
    },
  },
};
