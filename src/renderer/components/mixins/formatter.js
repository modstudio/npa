module.exports = {
  data() {
    return {
      formatter: null,
      formatterAmount: null,
    };
  },

  created() {
    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    this.formatterAmount = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
    });
  },
};
