<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    :label="label"
    placeholder="Choose Cause"    
    :source-data="data"
    @change="onChange"
  >
      <template v-slot:option>
      <option class="color-neutral-500"
        data-icon="icon icon-e-add"
        :value="-1"
      >
        Add new cause
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
      default: 'Cause',
    },
  },

  computed: {
    data() {
      return this.$store.getters['Categories/getCauses']
        .map(item => ({
          value: item.id,
          label: item.category_name,
          subtext: item.category_subtext,
          disabled: (item.is_inactive === 1),
          name: `${item.category_name} ${item.category_subtext}`,
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