import Vue from 'vue';

const transferId = 11;

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
    transferTypeId: () => transferId,
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
        const data = await Vue.db.all(`SELECT *
        FROM transaction_types
        WHERE id <> $transfer_id
        ORDER BY sort_order`, {
          $transfer_id: transferId,
        });
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

  },
};
