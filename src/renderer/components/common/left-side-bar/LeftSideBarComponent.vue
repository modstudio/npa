<template>
  <aside class="sidebar">
    <div class="color-neutral-500 flex-grow-1">
      <div class="sidebar-nav">
        <search-bar-component
          :value="value"
          :search-placeholder="searchPlaceholder"
          :is-filtered="isFiltered"
          @input="searchText => $emit('input', searchText)"
          @resetfilter="$emit('resetfilter')"
          @search="$emit('search')"
        ></search-bar-component>
        <slot></slot>
      </div>
    </div>

    <settings-button-component></settings-button-component>
  </aside>
</template>

<script>
import SearchBarComponent from './SearchBarComponent';
import SettingsButtonComponent from './SettingsButtonComponent';

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
    searchPlaceholder: {
      type: String,
      default: 'Search',
    },
  },

  components: {
    SearchBarComponent,
    SettingsButtonComponent,
  },

  methods: {
  },
};
</script>

<style>

</style>
