<template>
  <div>
    <register-left-side-component
      v-model="searchText"
      :is-filtered="isFiltered"
      @resetfilter="resetFilter"
    >
      <range-filter-component
        name-filter="Date"
        type="date"
        v-model="dateFilter"
        collapse-event="clear-register-filter"
      ></range-filter-component>    
      <type-filter-component
        v-model="typeFilter"
        @filter="filterData"
      ></type-filter-component>
      <category-type-filter-component
        v-model="categoryFilter"
        @filter="filterData"
      ></category-type-filter-component>
      <method-filter-component
        v-model="methodFilter"
        @filter="filterData"
      ></method-filter-component>
      <contact-filter-component
        v-model="contactFilter"
        @filter="filterData"
      ></contact-filter-component>
      <range-filter-component
        name-filter="Amount"
        v-model="amountFilter"
        collapse-event="clear-register-filter"
      ></range-filter-component>
      <notes-filter-component
        v-model="notesFilter"
      ></notes-filter-component>      
    </register-left-side-component>
    <layouts-container-lg-component>
      <div class="d-flex">
        <div class="flex-grow-1 d-flex">
          {{data.length}}
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

      <register-transfer-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewTransferPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="getData"
        @add-new="addNewTransfer"
      ></register-transfer-side-bar-component> 
      <register-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="getData"
        @add-new="addItem"
      ></register-side-bar-component>     
    </layouts-container-lg-component>
  </div>
</template>

<script>
import RegisterLeftSideComponent from './RegisterPage/RegisterLeftSideComponent';
import RegisterSideBarComponent from './RegisterPage/RegisterSideBarComponent';
import RegisterTransferSideBarComponent from './RegisterPage/RegisterTransferSideBarComponent';
import ContactNameFieldComponent from './common/ContactNameFieldComponent';
import RegisterRowComponent from './RegisterPage/RegisterRowComponent';
import Bus from '../shared/EventBus';

const tableSortColumnMixin = require('./mixins/table-sort-column');
export default {
  components: {
    RegisterLeftSideComponent,
    RegisterSideBarComponent,
    RegisterTransferSideBarComponent,
    ContactNameFieldComponent,
    RegisterRowComponent,
  },

  mixins: [
    tableSortColumnMixin,
  ],

  beforeRouteEnter(to, from, next) {
    next();
    Bus.$emit('open-register-page');
  },

  data() {
    return {
      isViewPanel: false,
      isViewTransferPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      refNameSortCol: ['sortDate'],
      sortField: 'date',
      sortOrder: 'asc',
      dateFilter: null,
      typeFilter: [],
      categoryFilter: [],
      methodFilter: [],
      contactFilter: [],
      amountFilter: null,
      notesFilter: 0,
    };
  },

  computed: {
    isFiltered() {
      return !!(this.searchText || this.typeFilter.length || this.categoryFilter.length
        || this.methodFilter.length || this.contactFilter.length || this.amountFilter
        || this.dateFilter || this.notesFilter);
    },

    data: {
      get() {
        let { data } = this.$store.state.Transactions;
        if (this.typeFilter.length) {
          data = data.filter(item => this.typeFilter.includes(item.transaction_type_id));
        }
        if (this.categoryFilter.length) {
          data = data.filter(item => this.categoryFilter.includes(item.category_type_id)
            || this.categoryFilter.includes(item.transfer_category_type_id));
        }
        if (this.methodFilter.length) {
          data = data.filter(item => this.methodFilter.includes(item.transaction_method_id));
        }
        if (this.contactFilter.length) {
          data = data.filter(item => this.contactFilter.includes(item.contact_id)
            || this.contactFilter.includes(item.category_contact_id)
            || this.contactFilter.includes(item.transfer_category_contact_id));
        }
        if (this.amountFilter) {
          data = data.filter((item) => {
            let rule = true;
            if (this.amountFilter.from) {
              rule = rule && item.amount >= this.amountFilter.from;
            }
            if (this.amountFilter.to) {
              rule = rule && item.amount <= this.amountFilter.to;
            }
            return rule;
          });
        }
        if (this.dateFilter) {
          data = data.filter((item) => {
            let rule = true;
            if (this.dateFilter.from) {
              rule = rule && moment(item.date).isSameOrAfter(this.dateFilter.from);
            }
            if (this.dateFilter.to) {
              rule = rule && moment(item.date).isSameOrBefore(this.dateFilter.to);
            }
            return rule;
          });
        }
        if (this.notesFilter === 2) {
          data = data.filter(item => item.note);
        }
        if (this.searchText) {
          this.searchText.split(' ').forEach((searchItem) => {
            const searchString = searchItem.toLowerCase();
            data = data
              .filter(item => (item.contact_id
                    && (item.contact_company_name.toLowerCase().indexOf(searchString) !== -1
                    || item.contact_first_name.toLowerCase().indexOf(searchString) !== -1
                    || item.contact_last_name.toLowerCase().indexOf(searchString) !== -1))
                  || item.type_name.toLowerCase().indexOf(searchString) !== -1
                  || (item.method_name
                    && item.method_name.toLowerCase().indexOf(searchString) !== -1)
                  || (item.number && item.number.toLowerCase().indexOf(searchString) !== -1)
                  || item.category_name.toLowerCase().indexOf(searchString) !== -1
                  || (item.transaction_type_id !== this.transferTypeId
                    && item.category_description
                    && item.category_description.toLowerCase().indexOf(searchString) !== -1)
                  || item.amount.toString().toLowerCase().indexOf(searchString) !== -1
                  || (this.notesFilter === 1 && item.note
                    && item.note.toLowerCase().indexOf(searchString) !== -1)
                  || (this.categoryFilter.includes(2) && item.related_category_name
                    && item.related_category_name.toString()
                      .toLowerCase().indexOf(searchString) !== -1));
          });
        }
        let sortFields = [this.sortField];
        let sortOrders = [this.sortOrder];
        if (this.sortField === 'name') {
          sortFields = [function (item) {
            return item.contact_company_name ? item.contact_company_name
              : `${item.contact_first_name} ${item.contact_last_name}`;
          }];
          sortOrders = [this.sortOrder];
        }
        if (this.currentItem && !_.find(data, { id: this.currentItem.id })) {
          this.hidePanel();
        }
        return _.orderBy(data, sortFields, sortOrders);
      },
      async set(data) {
        await this.$store.commit('Transactions/setData', data);
      },
    },

    subtotal() {
      return this.data.reduce((sum, item) => (sum + item.amount), 0);
    },

    transferTypeId() {
      return this.$store.getters['TransactionTypes/transferTypeId'];
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('Transactions/getData');
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

    filterData() {
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
      Bus.$emit('clear-register-filter');
    },
  },
};
</script>

<style>

</style>
