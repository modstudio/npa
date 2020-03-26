<template>
  <filter-component
    v-bind="$attrs" 
    v-on="$listeners"
    name-filter="Category"
    name-all-item="All Categories"
    source-type="static"
    :source="data"
  ></filter-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.CategoryTypes.data || [];
    },
  },

  created() {
    this.initData();
  },

  methods: {
    initData() {
      if (!this.data.length) {
        this.$store.dispatch('CategoryTypes/getData');
      }
    },
  },
};
</script>

<style>

</style>