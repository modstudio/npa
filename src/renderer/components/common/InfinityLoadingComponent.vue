<template>
  <infinite-loading
      :distance="$root.config.infiniteLoadingDistance"
      :identifier="infiniteId"
      v-on="$listeners"
  >
      <div slot="spinner">
        <div class="position-relative mt-2">
          <loader-component :is-shown="true"></loader-component>
        </div>
      </div>
      <div slot="no-more">
      </div>
      <div slot="no-results"></div>
  </infinite-loading>
</template>

<script>
export default {
  props: {
    infiniteId: {
      type: Number,
      default: +new Date(),
    },
  },

};
</script>

<style>

</style>