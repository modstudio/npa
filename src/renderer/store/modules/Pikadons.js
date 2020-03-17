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
        const data = await Vue.db.all(`SELECT pikadons.*,
        contacts.company_name as contact_company_name, 
        contacts.first_name as contact_first_name, contacts.last_name as contact_last_name
        FROM pikadons JOIN contacts ON pikadons.contact_id = contacts.id
        ORDER BY case 
        when company_name <> '' then company_name
        else first_name || last_name
        end`);
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async addData(context, data) {
      let result;
      try {
        await Vue.db.run(`INSERT INTO pikadons (
          contact_id, note
        ) VALUES ($contact_id, $note)
        `, {
          $contact_id: data.contact_id,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error insert pikadons', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE pikadons SET
          contact_id = $contact_id,
          note = $note
          WHERE id = $id
        `, {
          $id: data.id,
          $contact_id: data.contact_id,
          $note: data.note,
        });
        result = true;
      } catch (err) {
        console.log('error update pikadons', err);
        result = false;
      }
      return result;
    },

    async deleteItem(context, id) {
      let result;
      try {
        await Vue.db.run('DELETE FROM pikadons WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE pikadons', err);
        result = false;
      }
      return result;
    },

  },
};
