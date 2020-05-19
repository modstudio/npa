import getters from './Transactions/getters';
import mutations from './Transactions/mutations';
import actions from './Transactions/actions';

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    data: [],
    page: 1,
    infiniteId: +new Date(),
    cacheData: [],
    filters: null,
    totalRows: null,
    reportData: [],
  },
  // -----------------------------------------------------------------
  getters,
  // -----------------------------------------------------------------
  mutations,
  // -----------------------------------------------------------------
  actions,
};
