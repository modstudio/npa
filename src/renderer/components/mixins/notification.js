module.exports = {
  methods: {
    showConfirmationMessage(message) {
      this.$notify({
        group: 'app',
        text: message,
        duration: 5000,
      });
    },
  },
};
