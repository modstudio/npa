export default {
  data() {
    return {
      isViewGeneralDonationForm: false,
      newGeneralDonationFormCallback: null,
    };
  },

  methods: {
    showGeneralDonationForm(callback = null) {
      this.isViewGeneralDonationForm = true;
      this.newGeneralDonationFormCallback = callback;
    },

    hideGeneralDonationForm() {
      this.isViewGeneralDonationForm = false;
    },

    onUpdateGeneralDonation(lastId) {
      this.$store.dispatch('Categories/getData')
        .then(() => {
          if (typeof this.newGeneralDonationFormCallback === 'function') {
            this.newGeneralDonationFormCallback(lastId);
          }
        });
    },
  },
};
