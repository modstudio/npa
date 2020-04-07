<template>
  <aside class="sidebar">
    <div class="color-neutral-500 flex-grow-1">
      <div class="nav tabs-inner tabs-inner--sm align-self-center d-none d-sm-flex mt-4 mx-4">
        <button type="button" class="tabs-inner__link px-0"
          @click="setMode('search')"
          :disabled="isSearchMode"
          :class="{'active': isSearchMode}">
          Search & Filter
        </button>
        <button type="button" class="tabs-inner__link px-0"
          @click="setMode('report')"
          :disabled="isReportMode"
          :class="{'active': isReportMode}">
          Quick Reports
        </button>
      </div>
      <div class="sidebar-nav">
      <search-bar-component
        :value="value"
        :is-filtered="isFiltered"
        :search-placeholder="searchPlaceholder"
        @input="searchText => $emit('input', searchText)"
        @resetfilter="$emit('resetfilter')"
        @search="$emit('search')"
      ></search-bar-component>        
      <div v-show="isSearchMode">
        <slot name="search"></slot>
      </div>
      <div v-show="isReportMode">
        <slot name="register"></slot>
      </div>
      </div>
    </div>

    <settings-button-component></settings-button-component>
  </aside>
</template>

<script>
import SearchBarComponent from '../common/left-side-bar/SearchBarComponent';
import SettingsButtonComponent from '../common/left-side-bar/SettingsButtonComponent';

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
    SettingsButtonComponent,
  },

  data() {
    return {
      mode: 'search',
    };
  },

  computed: {
    isSearchMode() {
      return this.mode === 'search';
    },

    isReportMode() {
      return this.mode === 'report';
    },

    searchPlaceholder() {
      return this.isSearchMode ? 'Search Register' : 'Search Reports';
    },
  },

  methods: {
    setMode(mode) {
      this.mode = mode;
    },
  },
};
</script>

<style>

</style>