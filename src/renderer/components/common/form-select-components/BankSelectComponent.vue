<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    :label="label"
    placeholder="Choose Bank"    
    :source-data="data"
    @change="onChange"
  >
    <template v-slot:option>
      <option class="color-neutral-500"
        data-icon="icon icon-e-add"
        :value="-1"
      >
        Add new banks
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
      default: 'Bank',
    },
  },

  computed: {
    data() {
      return this.$store.state.Banks.data
        .map(item => ({
          value: item.id,
          label: item.name,
          name: item.name,
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
        this.$store.dispatch('Banks/getData');
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