<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    :label="label"
    placeholder="Choose Cause"    
    :source-data="data"
  ></select-component>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    label: {
      type: String,
      default: 'Cause',
    },
  },

  computed: {
    data() {
      return this.$store.getters['Categories/getCauses']
        .filter(item => item.is_inactive === 0 || item.id === this.value)
        .map(item => ({
          value: item.id,
          label: item.category_name,
          subtext: item.category_subtext,
          disabled: (item.is_inactive === 1),
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