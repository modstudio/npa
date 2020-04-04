<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
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
      return this.$store.getters['Contacts/contacts']
        .filter(item => item.is_inactive === 0 || item.id === this.value)
        .map(item => ({
          value: item.id,
          label: (item.company_name ? item.company_name : `${item.first_name} ${item.last_name}`),
          subtext: (item.company_name ? `${item.first_name} ${item.last_name}` : ''),
          name: `${item.company_name} ${item.first_name} ${item.last_name}`,
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
        this.$store.dispatch('Contacts/getData');
      }
    },
  },
};
</script>

<style>

</style>