export default {
  data() {
    return {
      isViewCauseForm: false,
      newCauseFormCallback: null,
    };
  },

  methods: {
    showCauseForm(callback = null) {
      this.isViewCauseForm = true;
      this.newCauseFormCallback = callback;
    },

    hideCauseForm() {
      this.isViewCauseForm = false;
    },

    onUpdateCause(lastId) {
      this.$store.dispatch('Categories/getData')
        .then(() => {
          if (typeof this.newCauseFormCallback === 'function') {
            this.newCauseFormCallback(lastId);
          }
        });
    },
  },
};
