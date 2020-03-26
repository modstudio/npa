<template>
  <aside class="sidebar">
    <div class="color-neutral-500">
      <div class="sidebar-nav">
        <search-bar-component
          :value="value"
          :is-filtered="isFiltered"
          search-placeholder="Search Register"
          @input="searchText => $emit('input', searchText)"
          @resetfilter="$emit('resetfilter')"
        ></search-bar-component>
        <slot></slot>
      </div>
    </div>
  </aside>
</template>

<script>
import SearchBarComponent from '../common/search-bar/SearchBarComponent';

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    isFiltered: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    SearchBarComponent,
  },

  methods: {
  },
};
</script>

<style>

</style>