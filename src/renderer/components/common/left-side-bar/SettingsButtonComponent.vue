<template>
  <button type="button" class="btn btn-icon mx-auto mb-4"
    @click="showSettings">
    <i class="icon icon-gear"></i>
  </button>  
</template>

<script>
import Bus from '../../../shared/EventBus';

export default {
  methods: {
    showSettings() {
      Bus.$emit('show-settings');
    },
  },
};
</script>

<style>

</style>