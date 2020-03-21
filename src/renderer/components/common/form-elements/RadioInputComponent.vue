<template>
  <div class="form-group mb-0" :class="formGroupClass">
    <label class="form-radio form-radio--block" :class="labelClass">
      <input type="radio"
        :name="name"
        :value="radioValue"
        :checked="value === radioValue"
        :disabled="disabled"
        @change="onChange"
        >
      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    radioValue: {
      type: [String, Number],
      default: '',
    },
    name: {
      type: String,
      default: 'name',
    },
    label: {
      type: String,
      default: '',
    },
    labelClass: {
      type: String,
      default: '',
    },
    formGroupClass: {
      type: [Object, String],
      default: null,
    },
    type: {
      type: String,
      default: 'String',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onChange(event) {
      let { value } = event.target;
      if (this.type === 'Number') {
        value = Number(value);
      }
      this.$emit('input', value);
    },
  },
};
</script>

<style>

</style>
