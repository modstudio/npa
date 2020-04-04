<template>
  <filter-component
    v-bind="$attrs" 
    v-on="$listeners"
    name-filter="Type"
    name-all-item="All Types"
    source-type="static"
    :source="data"
  ></filter-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.TransactionTypes.data || [];
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