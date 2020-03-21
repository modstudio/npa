<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    label="Transaction Method"
    :source-data="data"
  ></select-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.TrxMethods.data.map(item => ({
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
      if (!this.data.length) {
        this.$store.dispatch('TrxMethods/getData');
      }
    },
  },
};
</script>

<style>

</style>
