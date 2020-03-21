<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    label="Distribution Class"
    placeholder="Choose Distribution Class"
    :source-data="data"
  ></select-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.DistClasses.data.map(item => ({
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
        this.$store.dispatch('DistClasses/getData');
      }
    },
  },
};
</script>

<style>

</style>