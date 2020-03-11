<template>
  <ValidationProvider :name="label" :rules="{phone_number: countryCode}" v-slot="{ errors }">
    <div class="form-group form-group--enter">
        <vue-tel-input
            :value="value"
            @input="onInput"
            @validate="onValidate"
            @country-changed="onCountryChange"
            class="form-control form-control--enter"
            :name="name"
            :disabled-fetching-country="disabledFetchingCountry"
            :class="{'is-invalid': errors[0]}"
            :placeholder="placeholder"
            :preferred-countries="['US', 'CA']"
            mode="international"
            :dynamic-placeholder="true"
            aria-invalid="false"
            :input-id="inputId"
        ></vue-tel-input>
        <label>{{label}}</label>

        <span class="state-icon" v-show="fieldIsDirty">
            <i v-if="errors[0]" class="icon-warning"></i>
            <i v-else-if="isIconOk" class="icon-ok color-primary-500"></i>
        </span>

        <span class="state state--error" v-show="errors[0]">
            {{ errors[0] }}
        </span>
    </div>
  </ValidationProvider>
</template>

<script>
import VueTelInput from 'vue-tel-input';

export default {
  props: {
    inputId: {
      type: String,
      default: 'telInput',
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    name: {
      type: String,
      default: 'name',
    },
    label: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabledFetchingCountry: {
      type: Boolean,
      default: true,
    },
    scope: {
      type: String,
      default: '',
    },
    isIconOk: {
      type: Boolean,
      default: false,
    },
  },
  comonents: { VueTelInput },

  computed: {
    fieldIsDirty() {
      const fields = this.scope ? this.fields[`$${this.scope}`] : this.fields;
      return fields && fields[this.name] && fields[this.name].dirty;
    },
  },

  data() {
    return {
      countryCode: '',
    };
  },

  methods: {
    onInput(value, telObject) {
      this.countryCode = telObject.regionCode;
      this.$emit('input', value);
    },

    onValidate(validate) {
      this.countryCode = validate.regionCode;
    },

    onCountryChange(country) {
      this.$emit('country-change', country.iso2);
    },
  },
};
</script>

<style>

</style>
