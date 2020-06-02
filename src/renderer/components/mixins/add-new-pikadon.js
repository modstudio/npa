export default {
  data() {
    return {
      isViewPikadonForm: false,
      newPikadonFormCallback: null,
    };
  },

  methods: {
    showPikadonForm(callback = null) {
      this.isViewPikadonForm = true;
      this.newPikadonFormCallback = callback;
    },

    hidePikadonForm() {
      this.isViewPikadonForm = false;
    },

    onUpdatePikadon(lastId) {
      this.$store.dispatch('Categories/getData')
        .then(() => {
          if (typeof this.newPikadonFormCallback === 'function') {
            this.newPikadonFormCallback(lastId);
          }
        });
    },
  },
};
