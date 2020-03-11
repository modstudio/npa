<template>
  <div class="form-group form-group--enter">
    <div class="form-control form-control--enter"
      :class="additionalClass">{{value}}</div>
    <label v-if="label">{{label}}</label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    additionalClass: {
      type: String,
      default: null,
    },
  },
};
</script>

<style>

</style>
