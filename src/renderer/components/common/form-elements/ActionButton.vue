<template>
  <button
    type="submit"
    class="btn btn-primary"
    :class="additionalClass"
    @click.prevent="$emit('click')"
    :disabled="formBusy || disabled">
    <span v-if="formBusy">
        <div class="loader">
          <div class="loader__dot"></div>
          <div class="loader__dot"></div>
          <div class="loader__dot"></div>
        </div>
        {{loadingName}}
    </span>
    <span v-else>
        {{buttonName}}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    formBusy: {
      type: Boolean,
      default: false,
    },
    buttonName: {
      type: String,
      default: '',
    },
    loadingName: {
      type: String,
      default: 'Processing',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    additionalClass: {
      type: String,
      default: 'w-200',
    },
  },
};
</script>

<style>

</style>
