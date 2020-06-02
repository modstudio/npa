export default {
  data() {
    return {
      isViewLoanForm: false,
      newLoanFormCallback: null,
    };
  },

  methods: {
    showLoanForm(callback = null) {
      this.isViewLoanForm = true;
      this.newLoanFormCallback = callback;
    },

    hideLoanForm() {
      this.isViewLoanForm = false;
    },

    onUpdateLoan(lastId) {
      this.$store.dispatch('Categories/getData')
        .then(() => {
          if (typeof this.newLoanFormCallback === 'function') {
            this.newLoanFormCallback(lastId);
          }
        });
    },
  },
};
