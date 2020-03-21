<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"  
    :source-data="data"
    :is-data-group="true"
  ></select-component>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Cause',
    },
  },

  computed: {
    data() {
      return this.$store.getters['StartingBalanceCategories/data'];
    },
  },
};
</script>

<style>

</style>