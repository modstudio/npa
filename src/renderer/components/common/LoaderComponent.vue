<template>
  <div class="loader"  v-show="isShown">
    <div class="loader__dot"></div>
    <div class="loader__dot"></div>
    <div class="loader__dot"></div>
  </div>
</template>

<script>
export default {
  props: {
    isShown: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>

</style>
