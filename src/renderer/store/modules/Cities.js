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
        const data = await Vue.db.all(`
          SELECT * FROM cities
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
        const stm = await Vue.db.run(`INSERT INTO cities (
          city, state, zip, country, sort_order
        ) VALUES ($city, $state, $zip, $country, (select ifnull(max(sort_order), 0) + 1 from cities))
        `, {
          $city: data.city,
          $state: data.state,
          $zip: data.zip,
          $country: data.country,
        });
        result = stm.lastID;
      } catch (err) {
        console.log('error insert city', err);
        result = false;
      }
      return result;
    },

    async updateData(context, data) {
      let result;
      try {
        await Vue.db.run(`UPDATE cities SET
        city = $city,
        state = $state,
        zip = $zip,
        country = $country
        WHERE id = $id
        `, {
          $id: data.id,
          $city: data.city,
          $state: data.state,
          $zip: data.zip,
          $country: data.country,
        });
        result = true;
      } catch (err) {
        console.log('error update city', err);
        result = false;
      }
      return result;
    },

    async archiveItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE cities SET is_inactive = 1 WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error archive cities', err);
        result = false;
      }
      return result;
    },

    async activateItem(context, id) {
      let result;
      try {
        await Vue.db.run('UPDATE cities SET is_inactive = 0 WHERE id = ?', [id]);
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
        await Vue.db.run('DELETE FROM cities WHERE id = ?', [id]);
        result = true;
      } catch (err) {
        console.log('error DELETE cities', err);
        result = false;
      }
      return result;
    },

    async setSortOrder(context, { id, sortOrder }) {
      let result;
      try {
        await Vue.db.run(`UPDATE cities SET
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
        console.log('error update sort_order of cities', err);
        result = false;
      }
      return result;
    },

    async checkAssociation(context, id) {
      try {
        const result = await Vue.db.get(`SELECT count(*) as cnt
        FROM contacts where city_id = ?`, [id]);
        return result.cnt > 0;
      } catch (err) {
        console.log('error check assoc for city', err);
        return null;
      }
    },
  },
};
