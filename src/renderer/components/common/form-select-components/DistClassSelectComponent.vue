<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    label="Distribution Class"
    placeholder="Choose Distribution Class"
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
      return this.$store.state.DistClasses.data
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
        this.$store.dispatch('DistClasses/getData');
      }
    },
  },
};
</script>

<style>

</style>