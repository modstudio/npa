<template>
  <select-component
    v-model="selected"
    label="Country"
    :disabled="disabled"
    placeholder="Choose Country"
    :source-data="listCountries"
    @change="onChange"
    >
  </select-component>
</template>

<script>
import countries from './countries';

export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    value(newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        this.selected = newValue;
      }
    },
  },

  /**
     * The component's data.
     */
  data() {
    return {
      selected: this.value,
    };
  },

  computed: {
    listCountries() {
      return countries.map(item => ({
        value: item.code,
        label: item.name,
        ...item,
      }));
    },

  },

  methods: {
    /**
         * on change event
         *
         */
    onChange() {
      this.$emit('input', this.selected);
      this.$emit('change');
    },
  },
};
</script>

<style>

</style>
