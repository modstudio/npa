<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    :label="label"
    placeholder="Choose Group"    
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
      default: 'Group',
    },
  },

  computed: {
    data() {
      return this.$store.state.CauseGroups.data
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
        this.$store.dispatch('CauseGroups/getData');
      }
    },
  },
};
</script>

<style>

</style>