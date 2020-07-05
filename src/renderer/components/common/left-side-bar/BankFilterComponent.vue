<template>
  <filter-component
    v-bind="$attrs" 
    v-on="$listeners"
    name-filter="Bank"
    name-all-item="All Banks"
    source-type="static"
    :source="data"
  ></filter-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.Banks.data || [];
    },
  },

  created() {
    this.initData();
  },

  methods: {
    initData() {
      if (!this.data.length) {
        this.$store.dispatch('Banks/getData');
      }
    },
  },
};
</script>

<style>

</style>