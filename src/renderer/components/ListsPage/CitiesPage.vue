<template>
  <div>
      <left-side-bar-component
        v-model="searchText"
        search-placeholder="Search City"
        :is-filtered="isFiltered"
        @resetfilter="resetFilter"
      >
      <div class="px-4">
        <inactive-filter-component
          v-model="inactiveFilter"
        ></inactive-filter-component>
      </div>

      </left-side-bar-component>
      <div class="d-flex">
        <div class="flex-grow-1">
          {{data.length}}
          <template v-if="isFiltered">results</template>
          <template v-else>total</template>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" @click="addCity">
          Add City
        </button>
      </div>
      <div class="flex-table">
        <div class="flex-table__header">
          <div class="flex-table__header-item col-4">
            City
          </div>
          <div class="flex-table__header-item col-3">
            State/Province
          </div>
          <div class="flex-table__header-item col-2">
            Zip/Postal code
          </div>
        <div class="flex-table__header-item col-3">
            Country
          </div>
        </div>
        <div is="draggable" v-model="data" tag="div"
          handle=".list-components__item-move"
          @change="onSortChange">
          <div class="position-relative" v-for="item in data"
            :key="item.id">
            <span class="list-components__item-move">
              <i class="icon icon-drag"></i>
            </span>
            <div class="flex-table__row w-shadow"
              @click="viewItem(item)"
              :class="{'active': currentItem && currentItem.id === item.id}">
              <div class="flex-table__row-item col-4 font-weight-bold"
                  tabindex="0">
                  <inactive-badge-component v-if="item.is_inactive"></inactive-badge-component>
                  {{ item.city }}
              </div>
              <div class="flex-table__row-item col-3"
                  tabindex="0">
                {{ item.state }}
              </div>
              <div class="flex-table__row-item col-2"
                  tabindex="0">
                {{ item.zip }}
              </div>
              <div class="flex-table__row-item col-3"
                  tabindex="0">
                {{ item.country }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <no-result-found-component v-show="isFiltered && !data.length"></no-result-found-component>

      <cities-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="onUpdate"
        @add-new="addCity"
      ></cities-side-bar-component>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import SortOrderMixin from '../mixins/sort-order';
import CitiesSideBarComponent from './CitiesPage/CitiesSideBarComponent';
import Bus from '../../shared/EventBus';

export default {
  components: {
    draggable,
    CitiesSideBarComponent,
  },

  mixins: [
    SortOrderMixin,
  ],

  activated() {
    Bus.$emit('open-cities-page');
  },

  data() {
    return {
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      sortOrderActionName: 'Cities/setSortOrder',
      inactiveFilter: 0,
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchText || this.inactiveFilter !== 0;
    },

    data: {
      get() {
        let { data } = this.$store.state.Cities;
        if (this.inactiveFilter === 0) {
          data = data.filter(item => item.is_inactive === 0);
        } else if (this.inactiveFilter === 2) {
          data = data.filter(item => item.is_inactive === 1);
        }
        if (this.searchText) {
          const searchString = this.searchText.toLowerCase();
          data = data
            .filter(item => item.city.toLowerCase().indexOf(searchString) !== -1
              || item.state.toLowerCase().indexOf(searchString) !== -1
              || item.zip.toLowerCase().indexOf(searchString) !== -1
              || item.country.toLowerCase().indexOf(searchString) !== -1);
        }
        return data;
      },
      async set(data) {
        await this.$store.commit('Cities/setData', data);
      },
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('Cities/getData');
    },

    addCity() {
      this.currentItem = null;
      this.viewPanelMode = 'new';
      this.isViewPanel = true;
    },

    hidePanel() {
      this.isViewPanel = false;
      this.currentItem = null;
    },

    viewItem(item) {
      this.currentItem = item;
      this.viewPanelMode = 'edit';
      this.isViewPanel = true;
    },

    onUpdate() {
      this.getData();
      Bus.$emit('update-city');
    },

    resetFilter() {
      this.searchText = '';
      this.inactiveFilter = 0;
    },
  },
};
</script>

<style>

</style>
