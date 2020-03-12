<template>
 <!-- Container LG = 1040px -->
  <div class="dashboard-body">
      <div class="container container--lg" :class="additionalClass">
        <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    additionalClass: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>

</style>
