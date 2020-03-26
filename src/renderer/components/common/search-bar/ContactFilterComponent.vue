<template>
  <filter-component
    v-bind="$attrs" 
    v-on="$listeners"
    name-filter="Payee"
    name-all-item="All Payes"
    source-type="static"
    :source="data"
  ></filter-component>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$store.state.Contacts.contacts
        ? this.$store.state.Contacts.contacts
          .map(item => ({
            id: item.id,
            name: (item.company_name ? item.company_name : `${item.first_name} ${item.last_name}`),
            subtext: (item.company_name ? `${item.first_name} ${item.last_name}` : ''),
          })) : [];
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