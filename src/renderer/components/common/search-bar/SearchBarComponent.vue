<template>
  <div class="search-nav-block">
    <div class="search-nav-block__field search-nav-block__item">
      <div class="flex-fill position-relative">
          <input type="text" class="form-control form-control--search"
              ref="searchInput"
              :value="value"
              @input="$emit('input', $event.target.value)"
              :placeholder="searchPlaceholder"
              @keyup="search">
          <div class="form-control--search-icon" :class="{'active': searchText }">
              <i class="icon-search"></i>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    searchPlaceholder: {
      type: String,
      default: 'Search',
    },
  },

  /**
     * The component's data.
     */
  data() {
    return {
      searchText: '',
    };
  },

  created() {
    this.search = this.$root.createDebounce(() => this.$emit('search'));
  },
};
</script>

<style>

</style>