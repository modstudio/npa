<template>
  <option v-show="!shouldBeHidden && isActive"
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

    selectedValue: {
      type: [Number, String, Array],
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

    // Check if item is active
    isActive() {
      return !this.item.is_inactive
        || (Array.isArray(this.selectedValue)
          ? this.selectedValue.includes(this.item.id) : this.item.id === this.selectedValue);
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
