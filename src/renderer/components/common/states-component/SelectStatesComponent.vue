<template>
  <select-component
    v-model="selected"
    :label="label"
    :disabled="disabled"
    :source-data="listStates"
    @change="onChange"
    >
  </select-component>
</template>

<script>
import states from './states';

export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    country: {
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

  computed: {
    label() {
      return this.country === 'CA' ? 'Province' : 'State';
    },

    listStates() {
      let result = [];
      if (this.country in states) {
        result = states[this.country];
      }
      return result.map(item => ({
        value: item.name,
        label: item.name,
        ...item,
      }));
    },
  },

  /**
     * The component's data.
     */
  data() {
    return {
      selected: null,
    };
  },


  methods: {
    onChange() {
      this.$emit('input', this.selected);
    },
  },
};
</script>

<style>

</style>
