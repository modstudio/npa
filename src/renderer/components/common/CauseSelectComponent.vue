<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    label="Causes"
    placeholder="Chooce Cause"    
    :source-data="data"
  ></select-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.Causes.data.map(item => ({
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
        this.$store.dispatch('Causes/getData');
      }
    },
  },
};
</script>

<style>

</style>