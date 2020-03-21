<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :label="label"
    placeholder="Choose Pikadon"    
    :source-data="data"
  ></select-component>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Pikadon',
    },
  },

  computed: {
    data() {
      return this.$store.state.Pikadons.data.map(item => ({
        value: item.id,
        label: (item.contact_company_name ? item.contact_company_name
          : `${item.contact_first_name} ${item.contact_last_name}`),
        subtext: (item.contact_company_name
          ? `${item.contact_first_name} ${item.contact_last_name}` : ''),
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
      if (!this.data.length) {
        this.$store.dispatch('Pikadons/getData');
      }
    },
  },
};
</script>

<style>

</style>