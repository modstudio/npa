<template>
  <div class="flex-grow-1">
    <span class="subtext d-block">{{metricName}}</span>
    <amount-info-component :amount="amount"></amount-info-component>
  </div>
</template>

<script>
export default {
  props: {
    amount: {
      type: Number,
      default: null,
    },
    metricName: {
      type: String,
      default: null,
    },
  },
};
</script>

<style>

</style>