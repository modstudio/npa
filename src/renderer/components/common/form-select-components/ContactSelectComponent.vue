<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    :source-data="data"
    @change="onContactChange"
  >
    <template v-slot:option>
      <option class="color-neutral-500"
        data-icon="icon icon-e-add"
        :value="-1"
      >
        Add new contact
      </option>      
    </template>
  </select-component>
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

    onContactChange(value, selectedData, previousValue) {
      if (value === -1) {
        this.$nextTick(() => {
          this.$emit('input', Number(previousValue));
        });
        this.$emit('add-new');
      }
    },
  },
};
</script>

<style>

</style>