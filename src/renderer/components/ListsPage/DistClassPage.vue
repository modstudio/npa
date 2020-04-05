<template>
  <div>
      <left-side-bar-component
        v-model="searchText"
        search-placeholder="Search Dist. Class"
        :is-filtered="isFiltered"
        @resetfilter="resetFilter"
      >
        <inactive-filter-component
          v-model="inactiveFilter"
        ></inactive-filter-component>      
      </left-side-bar-component>
      <div class="d-flex">
        <div class="flex-grow-1">
          {{data.length}}
          <template v-if="isFiltered">results</template>
          <template v-else>total</template>          
        </div>
        <button type="button" class="btn btn-secondary btn-sm" @click="addDistClass">
          Add Dist. Class
        </button>
      </div>
      <div class="flex-table">
        <div class="flex-table__header">
          <div class="flex-table__header-item col-6">
            NAME
          </div>
          <div class="flex-table__header-item col-6">
            Distribution to date
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
              <div class="flex-table__row-item col-6 font-weight-bold"
                  tabindex="0">
                  {{ item.name }}
                  <inactive-badge-component class="ml-2" v-if="item.is_inactive"></inactive-badge-component>
              </div>
              <div class="flex-table__row-item col-6"
                  tabindex="0">
              </div>
            </div>
          </div>
        </div>
      </div>      
      <dist-class-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="onUpdate"
        @add-new="addDistClass"
      ></dist-class-side-bar-component>   
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import SortOrderMixin from '../mixins/sort-order';
import DistClassSideBarComponent from './DistClassPage/DistClassSideBarComponent';
import Bus from '../../shared/EventBus';

export default {
  components: {
    draggable,
    DistClassSideBarComponent,
  },

  mixins: [
    SortOrderMixin,
  ],

  beforeRouteEnter(to, from, next) {
    next();
    Bus.$emit('open-dist-class-page');
  },

  data() {
    return {
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      sortOrderActionName: 'DistClasses/setSortOrder',
      inactiveFilter: 0,
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchText || this.inactiveFilter !== 0;
    },

    data: {
      get() {
        let { data } = this.$store.state.DistClasses;
        if (this.inactiveFilter === 0) {
          data = data.filter(item => item.is_inactive === 0);
        } else if (this.inactiveFilter === 2) {
          data = data.filter(item => item.is_inactive === 1);
        }
        if (this.searchText) {
          const searchString = this.searchText.toLowerCase();
          data = data
            .filter(item => item.name.toLowerCase().indexOf(searchString) !== -1
              || item.note.toLowerCase().indexOf(searchString) !== -1);
        }
        return data;
      },
      async set(data) {
        await this.$store.commit('DistClasses/setData', data);
      },
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('DistClasses/getData');
    },

    addDistClass() {
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
      Bus.$emit('update-dist-class');
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