<template>
  <ValidationProvider :name="label" :rules="rules" v-slot="{ errors }">
    <div class="form-group form-group--enter" :class="formGroupClass">
      <textarea class="form-control form-control--enter"
        :value="value"
        v-bind="$attrs"
        @input="$emit('input', $event.target.value)"
        @change="$emit('change', $event.target.value)"
        @blur="$emit('blur')"        
      >
      </textarea>
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
    formGroupClass: {
      type: [Object, String],
      default: null,
    },
  },
};
</script>

<style>

</style>