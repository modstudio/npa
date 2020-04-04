<template>
  <filter-component
    v-bind="$attrs" 
    v-on="$listeners"
    name-filter="Method"
    name-all-item="All Methods"
    source-type="static"
    :source="data"
  ></filter-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.TrxMethods.data || [];
    },
  },

  created() {
    this.initData();
  },

  methods: {
    initData() {
      if (!this.data.length) {
        this.$store.dispatch('TrxMethods/getData');
      }
    },
  },
};
</script>

<style>

</style>