export default {
  data() {
    return {
      isViewBankForm: false,
      newBankFormCallback: null,
    };
  },

  methods: {
    showBankForm(callback = null) {
      this.isViewBankForm = true;
      this.newBankFormCallback = callback;
    },

    hideBankForm() {
      this.isViewBankForm = false;
    },

    onUpdateBank(lastId) {
      this.$store.dispatch('Banks/getData')
        .then(() => {
          if (typeof this.newBankFormCallback === 'function') {
            this.newBankFormCallback(lastId);
          }
        });
    },
  },
};
