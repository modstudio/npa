<template>
  <aside class="sidebar">
    <div class="color-neutral-500">
      <div class="sidebar-nav">
        <search-bar-component
          :value="value"
          search-placeholder="Search Cause"
          @input="searchText => $emit('input', searchText)"
        ></search-bar-component>
      </div>
    </div>
  </aside>
</template>

<script>
import SearchBarComponent from '../../common/search-bar/SearchBarComponent';

export default {
  props: {
    value: String,
    default: '',
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