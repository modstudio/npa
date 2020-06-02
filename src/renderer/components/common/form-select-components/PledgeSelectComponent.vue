<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    :label="label"
    placeholder="Choose Pledge"    
    :source-data="data"
    @change="onChange"
  >
    <template v-slot:option>
      <option class="color-neutral-500"
        data-icon="icon icon-e-add"
        :value="-1"
      >
        Add new pledge
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
    label: {
      type: String,
      default: 'Pledge',
    },
  },

  computed: {
    data() {
      return this.$store.getters['Categories/getPledges']
        .map(item => ({
          value: item.id,
          label: (item.contact_company_name ? item.contact_company_name
            : `${item.contact_first_name} ${item.contact_last_name}`),
          subtext: item.related_category_name,
          name: `${item.contact_company_name} ${item.contact_first_name} ${item.contact_last_name}`,
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
        this.$store.dispatch('Categories/getData');
      }
    },

    onChange(value, selectedData, previousValue) {
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