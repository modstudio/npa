module.exports = {
  data() {
    return {
      debounceTime: 500,
    };
  },

  methods: {
    createDebounce(func) {
      return _.debounce(func, this.debounceTime);
    },
  },
};
