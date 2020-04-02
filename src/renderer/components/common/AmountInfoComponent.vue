<template>
  <span :class="amountClass">{{amountPrefix}}{{absAmount}}</span>
</template>

<script>
export default {
  props: {
    amount: {
      type: [Number, String],
      default: null,
    },
    isColored: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    absAmount() {
      return Math.abs(this.amount).toFixed(2);
    },

    amountClass() {
      if (!this.isColored) {
        return '';
      }
      if (this.amount < 0) {
        return 'color-secondary-700';
      }
      if (this.amount > 0) {
        return 'color-primary-700';
      }
      return '';
    },

    amountPrefix() {
      return this.amount < 0 ? '-$' : '$';
    },
  },
};
</script>

<style>

</style>