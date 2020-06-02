export default {
  data() {
    return {
      isViewPledgeForm: false,
      newPledgeFormCallback: null,
    };
  },

  methods: {
    showPledgeForm(callback = null) {
      this.isViewPledgeForm = true;
      this.newPledgeFormCallback = callback;
    },

    hidePledgeForm() {
      this.isViewPledgeForm = false;
    },

    onUpdatePledge(lastId) {
      this.$store.dispatch('Categories/getData')
        .then(() => {
          if (typeof this.newPledgeFormCallback === 'function') {
            this.newPledgeFormCallback(lastId);
          }
        });
    },
  },
};
