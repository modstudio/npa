export default {
  data() {
    return {
      isViewContactForm: false,
      newContactFormCallback: null,
    };
  },

  methods: {
    showContactForm(callback = null) {
      this.isViewContactForm = true;
      this.newContactFormCallback = callback;
    },

    hideContactForm() {
      this.isViewContactForm = false;
    },

    onUpdateContact(lastId) {
      this.$store.dispatch('Contacts/getData')
        .then(() => {
          if (typeof this.newContactFormCallback === 'function') {
            this.newContactFormCallback(lastId);
          }
        });
    },
  },
};
