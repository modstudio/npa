<template>
  <div>
    <register-left-side-component
      v-model="searchText"
    ></register-left-side-component>
    <layouts-container-lg-component>
      <div class="d-flex">
        <div class="flex-grow-1">
          {{data.length}}
          <template v-if="isFiltered">results</template>
          <template v-else>total</template>        
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

      <register-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="getData"
        @add-new="addItem"
        @add-new-transfer="addNewTransfer"
      ></register-side-bar-component>
    </layouts-container-lg-component>
  </div>
</template>

<script>
import RegisterLeftSideComponent from './RegisterPage/RegisterLeftSideComponent';
import RegisterSideBarComponent from './RegisterPage/RegisterSideBarComponent';
import ContactNameFieldComponent from './common/ContactNameFieldComponent';
import RegisterRowComponent from './RegisterPage/RegisterRowComponent';
import Bus from '../shared/EventBus';

const tableSortColumnMixin = require('./mixins/table-sort-column');
export default {
  components: {
    RegisterLeftSideComponent,
    RegisterSideBarComponent,
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
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      refNameSortCol: ['sortDate'],
      sortField: 'date',
      sortOrder: 'asc',
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchText;
    },

    data: {
      get() {
        let { data } = this.$store.state.Transactions;
        if (this.searchText) {
          const searchString = this.searchText.toLowerCase();
          data = data
            .filter(item => (item.contact_id
                && (item.contact_company_name.toLowerCase().indexOf(searchString) !== -1
                || item.contact_first_name.toLowerCase().indexOf(searchString) !== -1
                || item.contact_last_name.toLowerCase().indexOf(searchString) !== -1))
              || item.type_name.toLowerCase().indexOf(searchString) !== -1
              || (item.method_name && item.method_name.toLowerCase().indexOf(searchString) !== -1)
              || (item.number && item.number.toLowerCase().indexOf(searchString) !== -1)
              || item.category_name.toLowerCase().indexOf(searchString) !== -1
              || (item.category_description
                && item.category_description.toLowerCase().indexOf(searchString) !== -1)
              || item.amount.toString().toLowerCase().indexOf(searchString) !== -1
              || (item.note && item.note.toLowerCase().indexOf(searchString) !== -1));
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

        return _.orderBy(data, sortFields, sortOrders);
      },
      async set(data) {
        await this.$store.commit('Transactions/setData', data);
      },
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
      this.viewPanelMode = 'new-transfer';
      this.isViewPanel = true;
    },

    addItem() {
      this.currentItem = null;
      this.viewPanelMode = 'new';
      this.isViewPanel = true;
    },

    hidePanel() {
      this.isViewPanel = false;
      this.currentItem = null;
      this.addTransfer = false;
    },

    viewItem(item) {
      this.currentItem = item;
      this.viewPanelMode = 'edit';
      this.isViewPanel = true;
    },
  },
};
</script>

<style>

</style>
