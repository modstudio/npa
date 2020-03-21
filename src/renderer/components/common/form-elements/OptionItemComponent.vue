<template>
  <option v-show="!shouldBeHidden"
    :value="item.value"
    :data-icon="item.icon"
    :data-subtext="item.subtext"
    :disabled="item.disabled"
    :data-content="content"
    @click.stop
  >{{item.label}}
  </option>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null,
    },

    searchText: {
      type: String,
      default: null,
    },
  },

  computed: {
    shouldBeHidden() {
      if (this.searchText) {
        return this.item.name.toLowerCase().indexOf(this.searchText.toLowerCase()) === -1;
      }
      return false;
    },

    content() {
      if (this.item.subtext) {
        return `${this.item.label} <span class="subtext">${this.item.subtext}</span>`;
      }
      return this.item.label;
    },
  },

};
</script>

<style>

</style>
