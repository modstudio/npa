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
        <bank-filter-component
          v-if="isActivePage"
          v-model="bankFilter"
          @filter="filterData"
        ></bank-filter-component>
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
      <div class="d-flex align-items-center">
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
        <button type="button" class="btn btn-icon btn-sm btn-icon--w-text"
          :disabled="!isChecked || isProcessing"
          @click="duplicate"
        >
         <i class="icon icon-ungroup mr-2"></i>
          <span>Duplicate</span>
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
            Payee/Donor
          </div>
          <div class="flex-table__header-item col-2 justify-content-end pr-4">
            Amount
          </div>
          <div class="flex-table__header-item col-2">
            Note
          </div>
        </div>
        <div class="position-relative" v-for="item in data"
          :key="item.id">
          <label class="form-checkbox form-checkbox--no-text form-checkbox--light list-components__item-move"
            @click.stop.prevent="selectItem(item)">
              <input type="checkbox"
                  v-model="item.checked" name="checked"
                  class="form-check-input">
              <span></span>
          </label>
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

      <register-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="onUpdate"
        @add-new="addItem"
        @duplicate="duplicateCurrentItem"
        @add-new-contact="showContactForm"
        @add-new-cause="showCauseForm"
        @add-new-pledge="showPledgeForm"
        @add-new-loan="showLoanForm"
        @add-new-pikadon="showPikadonForm"
        @add-new-general-donation="showGeneralDonationForm"
        @add-new-bank="showBankForm"
      ></register-side-bar-component>

      <pledge-side-bar-component
        :is-shown="isViewPledgeForm"
        mode="dialog-add-new"
        @hidepanel="hidePledgeForm"
        @update="onUpdatePledge"
        @add-new-contact="showContactForm"
        @add-new-cause="showCauseForm"
      ></pledge-side-bar-component>
      <cause-side-bar-component
        :is-shown="isViewCauseForm"
        mode="dialog-add-new"
        @hidepanel="hideCauseForm"
        @update="onUpdateCause"
        @add-new-contact="showContactForm"
      ></cause-side-bar-component>
      <loan-side-bar-component
        :is-shown="isViewLoanForm"
        mode="dialog-add-new"
        @hidepanel="hideLoanForm"
        @update="onUpdateLoan"
        @add-new-contact="showContactForm"
      ></loan-side-bar-component>
      <pikadon-side-bar-component
        :is-shown="isViewPikadonForm"
        mode="dialog-add-new"
        @hidepanel="hidePikadonForm"
        @update="onUpdatePikadon"
        @add-new-contact="showContactForm"
      ></pikadon-side-bar-component>
      <general-donation-side-bar-component
        :is-shown="isViewGeneralDonationForm"
        mode="dialog-add-new"
        @hidepanel="hideGeneralDonationForm"
        @update="onUpdateGeneralDonation"
        @add-new-contact="showContactForm"
      ></general-donation-side-bar-component>
      <contact-side-bar-component
        :is-shown="isViewContactForm"
        mode="dialog-add-new"
        @hidepanel="hideContactForm"
        @update="onUpdateContact"
      ></contact-side-bar-component>
      <bank-side-bar-component
        :is-shown="isViewBankForm"
        mode="dialog-add-new"
        @hidepanel="hideBankForm"
        @update="onUpdateBank"
      ></bank-side-bar-component>

    </layouts-container-lg-component>
  </div>
</template>

<script>
import Bus from '../shared/EventBus';
import RegisterLeftSideComponent from './RegisterPage/RegisterLeftSideComponent';
import RegisterSideBarComponent from './RegisterPage/RegisterSideBarComponent';
import ContactNameFieldComponent from './common/ContactNameFieldComponent';
import RegisterRowComponent from './RegisterPage/RegisterRowComponent';
import RegisterReportComponent from './RegisterPage/RegisterReportComponent';
import InfinityLoadingComponent from './common/InfinityLoadingComponent';
import ContactSideBarComponent from './ContactsPage/ContactSideBarComponent';
import CauseSideBarComponent from './ListsPage/CausePage/CauseSideBarComponent';
import PledgeSideBarComponent from './ListsPage/PledgePage/PledgeSideBarComponent';
import LoanSideBarComponent from './ListsPage/LoanPage/LoanSideBarComponent';
import PikadonSideBarComponent from './ListsPage/PikadonPage/PikadonSideBarComponent';
import GeneralDonationSideBarComponent from './ListsPage/GeneralDonationPage/GeneralDonationSideBarComponent';
import BankSideBarComponent from './ListsPage/BanksPage/BankSideBarComponent';
import addNewContactMixin from './mixins/add-new-contact';
import addNewCauseMixin from './mixins/add-new-cause';
import addNewPledgeMixin from './mixins/add-new-pledge';
import addNewLoanMixin from './mixins/add-new-loan';
import addNewPikadonMixin from './mixins/add-new-pikadon';
import addNewGeneralDonationMixin from './mixins/add-new-general-donation';
import addNewBankMixin from './mixins/add-new-bank';

const tableSortColumnMixin = require('./mixins/table-sort-column');
export default {
  components: {
    RegisterLeftSideComponent,
    RegisterSideBarComponent,
    ContactNameFieldComponent,
    RegisterRowComponent,
    RegisterReportComponent,
    InfinityLoadingComponent,
    ContactSideBarComponent,
    CauseSideBarComponent,
    PledgeSideBarComponent,
    LoanSideBarComponent,
    PikadonSideBarComponent,
    GeneralDonationSideBarComponent,
    BankSideBarComponent,
  },

  mixins: [
    tableSortColumnMixin,
    addNewContactMixin,
    addNewCauseMixin,
    addNewPledgeMixin,
    addNewLoanMixin,
    addNewPikadonMixin,
    addNewGeneralDonationMixin,
    addNewBankMixin,
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
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      refNameSortCol: ['sortDate'],
      sortField: 'date',
      sortOrder: 'desc',
      dateFilter: null,
      typeFilter: [],
      bankFilter: [],
      categoryFilter: [],
      methodFilter: [],
      contactFilter: [],
      amountFilter: null,
      notesFilter: 0,
      inactiveFilter: 0,
      reportData: null,
      isProcessing: false,
      isLoading: false,
      delayTimerId: null,
    };
  },

  computed: {
    isFiltered() {
      return !!(this.searchText || this.typeFilter.length || this.categoryFilter.length
        || this.methodFilter.length || this.contactFilter.length || this.amountFilter
        || this.dateFilter || this.notesFilter || this.inactiveFilter || this.bankFilter.length);
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

    isChecked() {
      return this.data.some(item => item.checked);
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
      this.isLoading = true;
      await this.$store.dispatch('Transactions/getDataPage', {
        sortOrder: this.sortOrder,
      });
      $state.loaded();
      if (this.totalRows === this.data.length) {
        $state.complete();
      }
      this.isLoading = false;
    },

    onUpdate() {
      this.resetInfiniter();
      this.runReport();
    },

    addItem() {
      this.currentItem = null;
      this.viewPanelMode = 'new';
      this.isViewPanel = true;
    },

    duplicateCurrentItem() {
      this.currentItem = {
        ...this.currentItem,
        id: null,
        date: new Date(),
        amount: 0,
      };
      this.viewPanelMode = 'duplicate';
      this.viewPanel();
    },

    hidePanel() {
      this.isViewPanel = false;
      this.currentItem = null;
    },

    viewPanel() {
      this.isViewPanel = true;
      this.hideAllForms();
    },

    viewItem(item) {
      this.currentItem = item;
      this.viewPanelMode = 'edit';
      this.viewPanel();
    },

    hideAllForms() {
      this.hideContactForm();
      this.hidePledgeForm();
      this.hideCauseForm();
      this.hideLoanForm();
      this.hidePikadonForm();
      this.hideBankForm();
    },

    resetInfiniter() {
      if (this.isLoading) {
        if (this.delayTimerId) {
          clearTimeout(this.delayTimerId);
        }
        this.delayTimerId = _.delay(this.resetInfiniter, 100);
        return true;
      }
      if (this.delayTimerId) {
        clearTimeout(this.delayTimerId);
      }
      this.$store.commit('Transactions/resetInfiniter');
      return true;
    },

    filterData() {
      this.setFilters();
      this.resetInfiniter();
      this.runReport();
    },

    setFilters() {
      this.$store.commit('Transactions/setFilters', {
        search: this.searchText,
        type: this.typeFilter,
        bank: this.bankFilter,
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
      this.bankFilter = [];
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
      this.resetInfiniter();
    },

    selectItem(item) {
      const checked = !item.checked;
      this.$store.commit('Transactions/updateItem', {
        ...item,
        checked,
      });
      // Update related item for transfer
      if (item.transaction_type_id === this.transferTypeId) {
        let relatedItem;
        if (item.related_transaction_id) {
          relatedItem = this.data
            .find(transaction => (transaction.id === item.related_transaction_id));
        } else {
          relatedItem = this.data
            .find(transaction => (transaction.related_transaction_id === item.id));
        }
        if (relatedItem) {
          this.$store.commit('Transactions/updateItem', {
            ...relatedItem,
            checked,
          });
        }
      }
      this.hidePanel();
      this.hideAllForms();
    },

    async duplicate() {
      this.isProcessing = true;
      await Promise.all(this.data.filter(item => item.checked)
        .map(async (item) => {
          // for transfer use second transaction record only
          if (item.transaction_type_id !== this.transferTypeId || item.related_transaction_id) {
            await this.$store.dispatch('Transactions/duplicate', item);
          }
        }));
      this.resetInfiniter();
      this.isProcessing = false;
    },
  },
};
</script>
