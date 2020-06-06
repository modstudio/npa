export default {
  data() {
    return {
      isViewCityForm: false,
      newCityFormCallback: null,
    };
  },

  methods: {
    showCityForm(callback = null) {
      this.isViewCityForm = true;
      this.newCityFormCallback = callback;
    },

    hideCityForm() {
      this.isViewCityForm = false;
    },

    onUpdateCity(lastId) {
      this.$store.dispatch('Cities/getData')
        .then(() => {
          if (typeof this.newCityFormCallback === 'function') {
            this.newCityFormCallback(lastId);
          }
        });
    },
  },
};
