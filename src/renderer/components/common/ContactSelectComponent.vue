<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :source-data="data"
  ></select-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.Contacts.contacts.map(item => ({
        value: item.id,
        label: (item.company_name ? item.company_name : `${item.first_name} ${item.last_name}`),
        subtext: (item.company_name ? `${item.first_name} ${item.last_name}` : ''),
        name: `${item.company_name} ${item.first_name} ${item.last_name}`,
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