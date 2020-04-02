<template>
  <aside class="sidebar">
    <div class="color-neutral-500">
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
      <div v-show="isSearchMode">
        <search-bar-component
          :value="value"
          :is-filtered="isFiltered"
          search-placeholder="Search Register"
          @input="searchText => $emit('input', searchText)"
          @resetfilter="$emit('resetfilter')"
          @search="$emit('search')"
        ></search-bar-component>
        <slot name="search"></slot>
      </div>
      <div v-show="isReportMode">
        <slot name="register"></slot>
      </div>
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