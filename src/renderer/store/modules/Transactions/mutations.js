export default {
  setData(state, data) {
    state.data = data;
  },
  setCacheData(state, data) {
    state.cacheData = data;
  },
  setTotalRows(state, value) {
    state.totalRows = value;
  },
  setFilters(state, value) {
    state.filters = value;
  },
  setPage(state, value) {
    state.page = value;
  },
  resetInfiniter(state) {
    state.page = 1;
    state.data = [];
    state.cacheData = [];
    state.infiniteId += 1;
  },
  incrementInfiniter(state) {
    state.infiniteId += 1;
  },
  updateItem(state, data) {
    const index = state.data.findIndex(item => item.id === data.id);
    if (index !== -1) {
      state.data.splice(index, 1, { ...data });
    }
  },
  setReportData(state, data) {
    state.reportData = data;
  },
};
