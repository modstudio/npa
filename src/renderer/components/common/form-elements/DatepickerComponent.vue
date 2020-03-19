<template>
  <ValidationProvider :name="label" :rules="rules" v-slot="{ errors }">
    <div class="form-group form-group--enter">
        <datepicker
          wrapper-class="order-1"
          input-class="form-control form-control--enter"
          :name="name"
          :class="{'is-invalid': errors[0], ...additionalClass}"
          :placeholder="placeholder"
          :value="value"
          format="MM/dd/yyyy"
          :use-utc="true"
          :calendar-button="true"
          :typeable="true"
          calendar-button-icon="icon icon-triangle-down"
          @input="onInput"
        ></datepicker>

        <label v-if="label">
            {{ label }}
        </label>

        <span class="state state--error" v-show="errors[0]">
            {{ errors[0] }}
        </span>
    </div>
  </ValidationProvider>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  props: {
    value: {
      type: Date,
      default: null,
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
    placeholder: {
      type: String,
      default: '',
    },
    additionalClass: {
      type: Object,
      default: null,
    },
  },

  components: {
    Datepicker,
  },

  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style>

</style>
