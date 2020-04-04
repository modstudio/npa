<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    label="Transaction Method"
    :value="value"
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
  },

  computed: {
    data() {
      return this.$store.state.TrxMethods.data
        .filter(item => item.is_inactive === 0 || item.id === this.value)
        .map(item => ({
          value: item.id,
          label: item.name,
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
      if (!this.data.length) {
        this.$store.dispatch('TrxMethods/getData');
      }
    },
  },
};
</script>

<style>

</style>
