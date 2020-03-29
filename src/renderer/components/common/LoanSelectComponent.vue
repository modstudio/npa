<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    placeholder="Choose Loan"    
    :source-data="data"
  ></select-component>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Loan',
    },
  },

  computed: {
    data() {
      return this.$store.getters['Categories/getLoans'].map(item => ({
        value: item.id,
        label: (item.contact_company_name ? item.contact_company_name
          : `${item.contact_first_name} ${item.contact_last_name}`),
        subtext: item.description,
        name: `${item.contact_company_name} ${item.contact_first_name} ${item.contact_last_name}`,
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