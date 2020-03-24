<template>
  <ValidationProvider :name="label" :rules="rules" v-slot="{ errors }">
    <div class="form-group form-group--enter" :class="formGroupClass">
        <input type="text"
          class="form-control form-control--enter"
          :class="{'is-invalid': errors[0], ...additionalClass, ...currencyClass}"
          :placeholder="placeholder"
          :value="value"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          @input="onInput"
          @change="onChange"
          @blur="$emit('blur')"
          aria-invalid="false"
        >

        <label v-if="label">
            {{ label }}
        </label>

        <span class="state-icon">
          <i class="icon icon-USD"></i>
        </span>

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
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    additionalClass: {
      type: Object,
      default: null,
    },
    formGroupClass: {
      type: [Object, String],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    isCredit: {
      type: Boolean,
      default: false,
    },
    isDebit: {
      type: Boolean,
      default: false,
    },
    disableCurrencyClass: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    currencyClass() {
      if (this.disableCurrencyClass) {
        return null;
      }
      if (this.value < 0 || (this.value > 0 && this.isDebit)) {
        return { 'color-secondary-700': true };
      }

      if (this.value > 0) {
        return { 'color-primary-700': true };
      }
      return null;
    },
  },

  methods: {
    onInput($event) {
      if (/[0-9]/.test($event.data)
        || ($event.data === '.' && !this.value.toString().includes('.'))
        || $event.data === null) {
        this.$emit('input', $event.target.value);
      }
    },

    onChange($event) {
      const value = Number.parseFloat($event.target.value).toFixed(2);
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },

};
</script>

<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
