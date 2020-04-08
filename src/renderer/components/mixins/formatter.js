module.exports = {
  data() {
    return {
      formatter: null,
    };
  },

  created() {
    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  },
};
