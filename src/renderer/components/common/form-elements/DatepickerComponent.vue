<template>
  <ValidationProvider :name="label" :rules="rules" v-slot="{ errors }">
    <div class="form-group form-group--enter">
        <el-date-picker
          ref="datepicker"
          class="order-1 text-small w-auto"
          :value="value"
          :name="name"
          type="date"
          format="MM/dd/yyyy"
          @input="onInput"
          v-on="$listeners"
        ></el-date-picker>
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

  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style>

</style>
