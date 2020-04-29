module.exports = {
  methods: {
    rereadStore() {
      this.$store.dispatch('CategoryTypes/getData');
      this.$store.dispatch('TrxMethods/getData');
      this.$store.dispatch('TransactionTypes/getData');
      this.$store.dispatch('DistClasses/getData');
      this.$store.dispatch('CauseGroups/getData');
      this.$store.dispatch('Categories/getData');
      this.$store.dispatch('Contacts/getData');
    },
  },
};
