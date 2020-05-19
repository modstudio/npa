import Bus from '../../shared/EventBus';

export default {
  data() {
    return {
      isViewContactForm: false,
      addNewContactEvent: 'add-new-contact-id',
    };
  },

  methods: {
    showContactForm() {
      this.isViewContactForm = true;
    },

    hideContactForm() {
      this.isViewContactForm = false;
    },

    onUpdateContact(lastId) {
      this.$store.dispatch('Contacts/getData')
        .then(() => {
          Bus.$emit(this.addNewContactEvent, lastId);
        });
    },
  },
};
