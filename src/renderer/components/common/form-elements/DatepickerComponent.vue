<template>
  <ValidationProvider :name="label" :rules="rules" v-slot="{ errors }">
    <div class="form-group form-group--enter mb-0">
        <el-date-picker v-if="inputComponent === 'el-date'"
          ref="datepicker"
          class="order-1 text-small w-auto"
          :value="value"
          :name="name"
          type="date"
          format="MM/dd/yyyy"
          @input="onInput"
          v-on="$listeners"
        ></el-date-picker>
        <jewish-datepicker-input-component v-else-if="inputComponent === 'flexcal'"
          ref="datepicker"
          :value="value"
          :name="name"
          @input="onInput"
          v-on="$listeners"
        ></jewish-datepicker-input-component>
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
import JewishDatepickerInputComponent from './JewishDatepickerInputComponent';

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
    inputComponent: {
      type: String,
      default: 'flexcal', // el-date, flexcal
    },
  },

  components: {
    JewishDatepickerInputComponent,
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
