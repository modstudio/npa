<template>
  <div>
    <loan-left-side-component
      v-model="searchText"
    ></loan-left-side-component>
    <div class="d-flex">
      <div class="flex-grow-1">
        {{data.length}}
        <template v-if="isFiltered">results</template>
        <template v-else>total</template>        
      </div>
      <button type="button" class="btn btn-secondary btn-sm" @click="addItem">
        Add Loan
      </button>
    </div>
    <div class="flex-table">
      <div class="flex-table__header">
        <div class="flex-table__header-item col-3" ref="sortName"
          @click="setSortField('name')">
          Contact
          <i class="icon icon-triangle-down"></i>
        </div>
        <div class="flex-table__header-item col-3">
          Description
        </div>
        <div class="flex-table__header-item col-3">
          Metrics
        </div>
        <div class="flex-table__header-item col-3">
          Balance
        </div>                     
      </div>
      <div class="position-relative" v-for="item in data"
        :key="item.id">
        <div class="flex-table__row w-shadow"
          @click="viewItem(item)"
          :class="{'active': currentItem && currentItem.id === item.id}">
          <div class="flex-table__row-item col-3 font-weight-bold"
              tabindex="0">
              <contact-name-field-component
                :company-name="item.contact_company_name"
                :first-name="item.contact_first_name"
                :last-name="item.contact_last_name"
              ></contact-name-field-component>
          </div>
          <div class="flex-table__row-item col-3"
              tabindex="0">
            {{item.description}}
          </div>
          <div class="flex-table__row-item col-3"
              tabindex="0">
          </div>
          <div class="flex-table__row-item col-3"
              tabindex="0">
          </div>                        
        </div>
      </div>
    </div>      
    <loan-side-bar-component
      :current-item="currentItem"
      :is-shown="isViewPanel"
      :mode="viewPanelMode"
      @hidepanel="hidePanel"
      @update="onUpdate"
      @add-new="addItem"
    ></loan-side-bar-component>         
  </div>
</template>

<script>
import LoanLeftSideComponent from './LoanPage/LoanLeftSideComponent';
import LoanSideBarComponent from './LoanPage/LoanSideBarComponent';
import ContactNameFieldComponent from '../common/ContactNameFieldComponent';
import Bus from '../../shared/EventBus';

const tableSortColumnMixin = require('../mixins/table-sort-column');
export default {
  components: {
    LoanLeftSideComponent,
    LoanSideBarComponent,
    ContactNameFieldComponent,
  },


  mixins: [
    tableSortColumnMixin,
  ],

  beforeRouteEnter(to, from, next) {
    next();
    Bus.$emit('open-loan-page');
  },

  data() {
    return {
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      refNameSortCol: ['sortName'],
      sortField: 'name',
      sortOrder: 'asc',
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchText;
    },

    data: {
      get() {
        let data = this.$store.getters['Categories/getLoans'];
        if (this.searchText) {
          const searchString = this.searchText.toLowerCase();
          data = data
            .filter(item => item.contact_company_name.toLowerCase().indexOf(searchString) !== -1
              || item.contact_first_name.toLowerCase().indexOf(searchString) !== -1
              || item.contact_last_name.toLowerCase().indexOf(searchString) !== -1
              || item.description.toLowerCase().indexOf(searchString) !== -1
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
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('Categories/getData');
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
      Bus.$emit('update-category');
    },
  },
};
</script>

<style>

</style>