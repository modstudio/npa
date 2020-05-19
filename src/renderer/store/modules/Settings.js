import Vue from 'vue';

const autoCreateDonationForPledge = 'is_auto_create_donation_for_pledge';
export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    data: [],
  },
  // -----------------------------------------------------------------
  getters: {
    data: state => state.data,
    autoCreateDonationForPledge: (state) => {
      const item = state.data.find(item => item.name === autoCreateDonationForPledge);
      if (item) {
        return item.value;
      }
      return null;
    },
  },
  // -----------------------------------------------------------------
  mutations: {
    setData(state, data) {
      state.data = data;
    },
  },
  // -----------------------------------------------------------------
  actions: {
    async getData(context) {
      try {
        const data = await Vue.db.all('SELECT * FROM settings');
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

    async updateItem(context, { itemName, value }) {
      let result;
      try {
        await Vue.db.run(`UPDATE settings SET
          value = $value
          WHERE name = $name
        `, {
          $name: itemName,
          $value: value,
        });
        result = true;
      } catch (err) {
        console.log('error update settings', err);
        result = false;
      }
      return result;
    },
  },
};
