<template>
  <div>
    <register-left-side-component
      v-model="searchText"
      :is-filtered="isFiltered"
      @resetfilter="resetFilter"
      @search="filterData"
    >
      <template #search>
        <range-filter-component
          name-filter="Date"
          type="date"
          v-model="dateFilter"
          collapse-event="clear-register-filter"
          @input="filterData"
        ></range-filter-component>    
        <type-filter-component
          v-if="isActivePage"
          v-model="typeFilter"
          @filter="filterData"
        ></type-filter-component>
        <category-type-filter-component
          v-if="isActivePage"
          v-model="categoryFilter"
          @filter="filterData"
        ></category-type-filter-component>
        <method-filter-component
          v-if="isActivePage"
          v-model="methodFilter"
          @filter="filterData"
        ></method-filter-component>
        <contact-filter-component
          v-if="isActivePage"
          v-model="contactFilter"
          @filter="filterData"
        ></contact-filter-component>
        <range-filter-component
          name-filter="Amount"
          v-model="amountFilter"
          collapse-event="clear-register-filter"
          @filter="filterData"
        ></range-filter-component>
        <notes-filter-component
          v-if="isActivePage"
          v-model="notesFilter"
          @filter="filterData"
        ></notes-filter-component>
        <inactive-filter-component
          v-if="isActivePage"
          v-model="inactiveFilter"
          @filter="filterData"
        ></inactive-filter-component>        
      </template>
      <template #register>
        <register-report-component 
          :data="reportData"
          :search-report="searchText"
        ></register-report-component>
      </template> 
    </register-left-side-component>
    <layouts-container-lg-component>
      <div class="d-flex">
        <div class="flex-grow-1 d-flex">
          {{totalRows}}
          <template v-if="isFiltered">results</template>
          <template v-else>total</template> 
          <div v-if="isFiltered" class="ml-3">
            Subtotal
            <amount-info-component
              :amount="subtotal"
            ></amount-info-component>
          </div>       
        </div>
        <button type="button" class="btn btn-secondary btn-sm" @click="addNewTransfer">
          Add Transfer
        </button>
        <button type="button" class="btn btn-secondary btn-sm ml-3" @click="addItem">
          Add Transaction
        </button>        
      </div>
      <div class="flex-table">
        <div class="flex-table__header">
          <div class="flex-table__header-item col-2" ref="sortDate"
            @click="setSortField('date')">
            Date
            <i class="icon icon-triangle-down"></i>
          </div>
          <div class="flex-table__header-item col-2">
            Type
          </div>
          <div class="flex-table__header-item col-2">
            Category
          </div>
          <div class="flex-table__header-item col-2">
            Payee
          </div>
          <div class="flex-table__header-item col-2">
            Amount
          </div>
          <div class="flex-table__header-item col-2">
            Note
          </div>                                    
        </div>
        <div class="position-relative" v-for="item in data"
          :key="item.id">
          <register-row-component
            :item="item"
            :current-item="currentItem"
            @view="viewItem(item)"
          ></register-row-component>
        </div>
      </div>
      <infinity-loading-component
        :infiniteId="infiniteId"
        @infinite="infiniteHandler"
      ></infinity-loading-component>

      <no-result-found-component v-show="isFiltered && !totalRows"></no-result-found-component>

      <register-transfer-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewTransferPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="onUpdate"
        @add-new="addNewTransfer"
      ></register-transfer-side-bar-component> 
      <register-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="onUpdate"
        @add-new="addItem"
      ></register-side-bar-component>     
    </layouts-container-lg-component>
  </div>
</template>

<script>
import Bus from '../shared/EventBus';
import RegisterLeftSideComponent from './RegisterPage/RegisterLeftSideComponent';
import RegisterSideBarComponent from './RegisterPage/RegisterSideBarComponent';
import RegisterTransferSideBarComponent from './RegisterPage/RegisterTransferSideBarComponent';
import ContactNameFieldComponent from './common/ContactNameFieldComponent';
import RegisterRowComponent from './RegisterPage/RegisterRowComponent';
import RegisterReportComponent from './RegisterPage/RegisterReportComponent';
import InfinityLoadingComponent from './common/InfinityLoadingComponent';

const tableSortColumnMixin = require('./mixins/table-sort-column');
export default {
  components: {
    RegisterLeftSideComponent,
    RegisterSideBarComponent,
    RegisterTransferSideBarComponent,
    ContactNameFieldComponent,
    RegisterRowComponent,
    RegisterReportComponent,
    InfinityLoadingComponent,
  },

  mixins: [
    tableSortColumnMixin,
  ],

  activated() {
    this.isActivePage = true;
    Bus.$emit('open-register-page');
    this.$store.commit('Transactions/incrementInfiniter');
  },

  deactivated() {
    this.isActivePage = false;
  },

  data() {
    return {
      isActivePage: false,
      isViewPanel: false,
      isViewTransferPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      refNameSortCol: ['sortDate'],
      sortField: 'date',
      sortOrder: 'desc',
      dateFilter: null,
      typeFilter: [],
      categoryFilter: [],
      methodFilter: [],
      contactFilter: [],
      amountFilter: null,
      notesFilter: 0,
      inactiveFilter: 0,
      reportData: null,
    };
  },

  computed: {
    isFiltered() {
      return !!(this.searchText || this.typeFilter.length || this.categoryFilter.length
        || this.methodFilter.length || this.contactFilter.length || this.amountFilter
        || this.dateFilter || this.notesFilter || this.inactiveFilter);
    },

    page() {
      return this.$store.state.Transactions.page;
    },

    infiniteId() {
      return this.$store.state.Transactions.infiniteId;
    },

    data() {
      return this.$store.state.Transactions.data;
    },

    totalRows() {
      return this.$store.state.Transactions.totalRows;
    },

    subtotal() {
      return this.data.reduce((sum, item) => (sum + item.amount), 0);
    },

    transferTypeId() {
      return this.$store.getters['TransactionTypes/transferTypeId'];
    },
  },

  created() {
    this.setFilters();
    this.runReport();
    Bus.$on('update-contacts', this.onUpdate);
    Bus.$on('update-category', this.onUpdate);
    Bus.$on('update-dist-class', this.onUpdate);
    Bus.$on('update-method', this.onUpdate);
    Bus.$on('db-restored', this.resetFilter);
    Bus.$on('show-settings', this.hidePanel);
  },

  destroyed() {
    Bus.$off('update-contacts', this.onUpdate);
    Bus.$off('update-category', this.onUpdate);
    Bus.$off('update-dist-class', this.onUpdate);
    Bus.$off('update-method', this.onUpdate);
    Bus.$off('db-restored', this.resetFilter);
    Bus.$off('show-settings', this.hidePanel);
  },

  methods: {
    async infiniteHandler($state) {
      await this.$store.dispatch('Transactions/getDataPage', {
        sortOrder: this.sortOrder,
      });
      $state.loaded();
      if (this.totalRows === this.data.length) {
        $state.complete();
      }
    },

    onUpdate() {
      this.resetInfinter();
      this.runReport();
    },

    addNewTransfer() {
      this.currentItem = null;
      this.viewPanelMode = 'new';
      this.isViewTransferPanel = true;
      this.isViewPanel = false;
    },

    addItem() {
      this.currentItem = null;
      this.viewPanelMode = 'new';
      this.isViewPanel = true;
      this.isViewTransferPanel = false;
    },

    hidePanel() {
      this.isViewPanel = false;
      this.isViewTransferPanel = false;
      this.currentItem = null;
    },

    viewItem(item) {
      this.currentItem = item;
      this.viewPanelMode = 'edit';
      if (this.currentItem.transaction_type_id === this.transferTypeId) {
        this.isViewTransferPanel = true;
        this.isViewPanel = false;
      } else {
        this.isViewPanel = true;
        this.isViewTransferPanel = false;
      }
    },

    resetInfinter() {
      this.$store.commit('Transactions/resetInfiniter');
    },

    filterData() {
      this.setFilters();
      this.resetInfinter();
      this.runReport();
    },

    setFilters() {
      this.$store.commit('Transactions/setFilters', {
        search: this.searchText,
        type: this.typeFilter,
        category: this.categoryFilter,
        method: this.methodFilter,
        contact: this.contactFilter,
        amount: this.amountFilter,
        date: this.dateFilter,
        notes: this.notesFilter,
        inactive: this.inactiveFilter,
      });
    },

    resetFilter() {
      this.searchText = '';
      this.typeFilter = [];
      this.categoryFilter = [];
      this.methodFilter = [];
      this.contactFilter = [];
      this.amountFilter = null;
      this.dateFilter = null;
      this.notesFilter = 0;
      this.inactiveFilter = 0;
      Bus.$emit('clear-register-filter');
      this.filterData();
    },

    async runReport() {
      await this.$store.dispatch('Transactions/runReport');
      const data = [];
      let currentTypeId = null;
      const expandedIds = this.reportData ? this.reportData
        .filter(item => item.isExpanded)
        .map(item => item.id) : [];
      this.$store.state.Transactions.reportData.forEach((item) => {
        if (currentTypeId !== item.category_type_id) {
          data.push({
            id: item.category_type_id,
            name: item.category_type_name,
            isExpanded: expandedIds.includes(item.category_type_id),
            data: [],
          });
          currentTypeId = item.category_type_id;
        }
        let name = item.category_name;
        if (item.category_type_id === 2) {
          name = `${name}, ${item.related_category_name}`;
        } else if (item.category_type_id === 3) {
          name = `${name}, ${item.category_description}`;
        }
        data[data.length - 1].data.push({
          id: item.category_id,
          name,
          amount: item.sum_amount,
        });
      });
      this.reportData = data;
    },

    sortData() {
      this.setSortClasses();
      this.resetInfinter();
    },
  },
};
</script>

<style>

</style>
