<template>
  <span :class="amountClass">{{formatAmount}}</span>
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
    formatAmount() {
      return this.$root.formatter.format(this.amount);
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
  },
};
</script>

<style>

</style>