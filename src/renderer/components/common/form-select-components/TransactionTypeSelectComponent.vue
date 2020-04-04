<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    label="Transaction Type"
    placeholder="Choose type"    
    :source-data="data"
  ></select-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.TransactionTypes.data
        .filter(item => item.id !== this.transferTypeId)
        .map(item => ({
          value: item.id,
          label: item.name,
          ...item,
        }));
    },

    transferTypeId() {
      return this.$store.getters['TransactionTypes/transferTypeId'];
    },
  },

  created() {
    this.initData();
  },

  methods: {
    initData() {
      if (!this.data.length) {
        this.$store.dispatch('TransactionTypes/getData');
      }
    },
  },
};
</script>

<style>

</style>
