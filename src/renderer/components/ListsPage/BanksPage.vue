<template>
  <div>
    <left-side-bar-component
      v-model="searchText"
      search-placeholder="Search Banks"
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
      <button type="button" class="btn btn-secondary btn-sm" @click="addItem">
        Add Bank
      </button>
    </div>
    <div class="flex-table">
      <div class="flex-table__header">
        <div class="flex-table__header-item col-6 col-xl-4" ref="sortName"
          @click="setSortField('name')">
          Name
          <i class="icon icon-triangle-down"></i>
        </div>
        <div class="flex-table__header-item col-4">
          Metrics
        </div>
        <div class="flex-table__header-item col-2 col-xl-4" ref="sortMetric_balance"
          @click="setSortField('metric_balance')">
          Balance
          <i class="icon icon-triangle-down"></i>
        </div>
      </div>
      <div class="position-relative" v-for="item in data"
        :key="item.id">
        <div class="flex-table__row w-shadow"
          @click="viewItem(item)"
          :class="{'active': currentItem && currentItem.id === item.id}">
          <div class="flex-table__row-item col-6 col-xl-4 font-weight-bold"
              tabindex="0">
              <div class="flex-grow-1">
                {{item.name}}
              </div>
              <inactive-badge-component v-if="item.is_inactive"></inactive-badge-component>
          </div>
          <div class="flex-table__row-item col-2"
              tabindex="0">
            <metric-info-component
              metric-name="Additions"
              :amount="item.metric_kredit"
            ></metric-info-component>
          </div>
          <div class="flex-table__row-item col-2"
              tabindex="0">
            <metric-info-component
              metric-name="Subtractions"
              :amount="item.metric_debit"
            ></metric-info-component>
          </div>
          <div class="flex-table__row-item col-2 col-xl-4"
              tabindex="0">
            <amount-info-component class="col-12 col-xl-6 px-0 text-right"
              :amount="item.metric_balance"></amount-info-component>
          </div>
        </div>
      </div>
    </div>

    <no-result-found-component v-show="isFiltered && !data.length"></no-result-found-component>

    <bank-side-bar-component
      :current-item="currentItem"
      :is-shown="isViewPanel"
      :mode="viewPanelMode"
      @hidepanel="hidePanel"
      @update="onUpdate"
      @add-new="addItem"
    ></bank-side-bar-component>     
  </div>
</template>

<script>
import BankSideBarComponent from './BanksPage/BankSideBarComponent';
import Bus from '../../shared/EventBus';

const tableSortColumnMixin = require('../mixins/table-sort-column');
export default {
  components: {
    BankSideBarComponent,
  },

  mixins: [
    tableSortColumnMixin,
  ],

  activated() {
    Bus.$emit('open-bank-page');
  },

  data() {
    return {
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      refNameSortCol: ['sortName', 'sortMetric_balance'],
      sortField: 'name',
      sortOrder: 'asc',
      inactiveFilter: 0,
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchText || this.inactiveFilter !== 0;
    },

    data: {
      get() {
        let { data } = this.$store.state.Banks;
        if (this.inactiveFilter === 0) {
          data = data.filter(item => item.is_inactive === 0);
        } else if (this.inactiveFilter === 2) {
          data = data.filter(item => item.is_inactive === 1);
        }
        if (this.searchText) {
          const searchString = this.searchText.toLowerCase();
          data = data
            .filter(item => item.name.toLowerCase().indexOf(searchString) !== -1
              || (item.note && item.note.toLowerCase().indexOf(searchString) !== -1));
        }
        return _.orderBy(data, [this.sortField], [this.sortOrder]);
      },
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('Banks/getData');
    },

    addItem() {
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
      Bus.$emit('update-bank');
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
