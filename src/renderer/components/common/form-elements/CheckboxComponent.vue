<template>
  <ValidationProvider :name="label" :rules="rules" v-slot="{ errors }">
  <div class="form-group form-group--enter" :class="formGroupClass">
    <label class="form-checkbox form-checkbox--light"
      :class="{'is-invalid': errors[0], 'form-radio--block': isBlock}">
      <input type="checkbox"
        :name="name"
        :value="value"
        @change="onChange"
        :checked="value === 1"
        :disabled="disabled"
        >
      <span :class="{'state--error': errors[0]}">
        {{ label }}<span
          class="subtext-checkbox ml-2"
          :class="{'state--error': errors[0]}" v-if="subtext">
          {{subtext}}
        </span>
      </span>
    </label>

    <span class="state state--error" v-show="errors[0]">
        {{ errors[0] }}
    </span>
  </div>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    value: {
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
    rules: {
      type: [Object, String],
      default: '',
    },
    subtext: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: null,
    },
    formGroupClass: {
      type: [Object, String],
      default: null,
    },
    isDisplayErrorMessage: {
      type: Boolean,
      default: true,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onChange(event) {
      this.$emit('input', event.target.checked ? 1 : 0);
    },
  },
};
</script>

<style>

</style>
