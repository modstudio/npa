<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    placeholder="Choose Cause"    
    :source-data="data"
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
      return this.$store.getters['Categories/getCauses'].map(item => ({
        value: item.id,
        label: item.name,
        ...item,
      }));
    },
  },

  created() {
    this.initData();
  },

  methods: {
    initData() {
      if (!this.$store.state.Categories.data) {
        this.$store.dispatch('Categories/getData');
      }
    },
  },
};
</script>

<style>

</style>