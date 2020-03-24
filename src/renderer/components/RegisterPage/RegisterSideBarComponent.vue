<template>
  <div v-show="isShown">
    <right-side-bar-component
      header-image-url="./static/images/register.svg"
      header-image-style="background-size: auto;"
      init-event-name="open-register-page"
      @hidepanel="$emit('hidepanel')"
    >
      <template slot="header">{{ headerName }}</template>
      <template slot="headerBadge">{{ currentItem ? currentItem.id : '' }}</template>
      <div>
        <div class="info-sidebar__body" ref="form" v-show="!isDeleteMode">
            <div class="info-sidebar__block-header">
              <template v-if="isTransfer">
                <h4>Transfer</h4>
              </template>
              <template v-else>
                <h4>Transaction</h4>
              </template>
            </div>
            <ValidationObserver ref="observer">
              <!-- Transfer -->
              <template v-if='isTransfer'>
                <!-- Date -->
                <datepicker-component
                  v-model="form.date"
                  label="Date"
                  rules="required"
                ></datepicker-component>
                <!-- Category from -->
                <category-select-component
                  v-model="form.category_id"
                  label="From (Category)"
                  rules="required"
                  :transfer-amount="-form.amount"
                ></category-select-component>
                <!-- Category To -->
                <category-select-component
                  v-model="form.transfer_category_id"
                  label="To (Category)"
                  :rules="{required: true, is_not: form.category_id}"
                  :transfer-amount="form.amount"
                ></category-select-component>                        
                <!-- Amount -->
                <currency-input-component
                  v-model="form.amount"
                  label="Amount"
                  rules="required"
                  :is-debit="isDebit"
                  :disable-currency-class="true"
                ></currency-input-component>
              </template>
              
              <!-- Other Transactions -->
              <template v-else>
                <!-- Date -->
                <datepicker-component
                  v-model="form.date"
                  label="Date"
                  rules="required"
                ></datepicker-component>
                <!-- Transaction type -->
                <transaction-type-select-component
                  v-model="form.transaction_type_id"
                  rules="required"
                  @change="onTypeChange"
                ></transaction-type-select-component>
                <div class="row gutter-8" v-if="(isPledgePayment || !isPledge) && !isStartingBalance">
                  <div class="col-12 col-sm-6">
                    <!-- Transaction method -->
                    <trx-method-select-component
                      v-model="form.transaction_method_id"
                    ></trx-method-select-component>
                  </div>
                  <div class="col-12 col-sm-6">
                    <!-- number -->
                    <text-input-component
                      v-model="form.number"
                      label="Number"
                      :rules="{required: this.form.transaction_method_id === 1}"
                    ></text-input-component>
                  </div>
                </div>
                <!-- Cause -->
                <cause-select-component
                  v-if="isCause"
                  v-model="form.category_id"
                  label="Category"
                  rules="required"
                ></cause-select-component>
                <!-- Loan -->
                <loan-select-component
                  v-if="isLoan"
                  v-model="form.category_id"
                  label="Category"
                  rules="required"
                ></loan-select-component>
                <!-- Pikadon -->
                <pikadon-select-component
                  v-if="isPikadon"
                  v-model="form.category_id"
                  label="Category"
                  rules="required"
                ></pikadon-select-component>
                <!-- Pledge -->
                <pledge-select-component
                  v-if="isPledge"
                  v-model="form.category_id"
                  label="Category"
                  rules="required"
                ></pledge-select-component>
                <!-- Starting Balance -->
                <starting-balance-category-select-component
                  v-if="isStartingBalance"
                  v-model="form.category_id"
                  label="Category"
                  rules="required"
                ></starting-balance-category-select-component>
                <!-- Debit/Credit -->
                <debit-credit-component
                  v-if="isStartingBalance"
                  label="Starting Balance (+/-)"
                  v-model="form.debit_credit"
                ></debit-credit-component>
                <!-- Payee -->
                <contact-select-component
                  v-if="!isPledge && !isStartingBalance"
                  v-model="form.contact_id"
                  label="Payee"
                  :rules="{required: isDistribution}"
                ></contact-select-component>
                <!-- Amount -->
                <currency-input-component
                  v-model="form.amount"
                  label="Amount"
                  rules="required"
                  :is-debit="isDebit"
                ></currency-input-component>                      
                <!-- Note -->
                <textarea-component
                  v-model="form.note"
                  label="Note"
                ></textarea-component>
              </template>           
            </ValidationObserver>
        </div>

        <item-delete-dialog-component v-if="isDeleteMode"
          :item="currentItem"
          item-name="Transaction"
          store-action-name="Transactions/deleteItem"
          check-action-name=""
          @close-dialog="isDeleteMode = false"
          @item-deleted="onDeleteItem"
        ></item-delete-dialog-component>
      </div>
      <div class="info-sidebar__footer" v-show="!isDeleteMode">
        <footer-buttons-component
          v-if="!isDeleteMode"
          :is-new-mode="isNewMode"
          :is-saving-and-new-process="isSavingAndNewProcess"
          :is-saving-and-close-process="isSavingAndCloseProcess"
          @save-and-new="saveAndNew"
          @save-and-close="saveAndClose"
          @delete="deleteAction"
          @cancel="$emit('hidepanel')"
        ></footer-buttons-component>
      </div>
    </right-side-bar-component>
  </div>  
</template>

<script>
import ItemDeleteDialogComponent from '../common/right-side-bar/ItemDeleteDialogComponent';
import TransactionTypeSelectComponent from '../common/TransactionTypeSelectComponent';
import TrxMethodSelectComponent from '../common/TrxMethodSelectComponent';
import CauseSelectComponent from '../common/CauseSelectComponent';
import LoanSelectComponent from '../common/LoanSelectComponent';
import PikadonSelectComponent from '../common/PikadonSelectComponent';
import PledgeSelectComponent from '../common/PledgeSelectComponent';
import ContactSelectComponent from '../common/ContactSelectComponent';
import StartingBalanceCategorySelectComponent from '../common/StartingBalanceCategorySelectComponent';
import CategorySelectComponent from '../common/CategorySelectComponent';
import DebitCreditComponent from '../common/form-elements/DebitCreditComponent';
import sideBarPanelMixin from '../mixins/side-bar-panel';

export default {
  components: {
    ItemDeleteDialogComponent,
    TransactionTypeSelectComponent,
    TrxMethodSelectComponent,
    CauseSelectComponent,
    LoanSelectComponent,
    PikadonSelectComponent,
    PledgeSelectComponent,
    ContactSelectComponent,
    StartingBalanceCategorySelectComponent,
    CategorySelectComponent,
    DebitCreditComponent,
  },

  mixins: [sideBarPanelMixin],

  computed: {
    isNewMode() {
      return this.mode === 'new' || this.mode === 'new-transfer';
    },

    isTransfer() {
      return this.mode === 'new-transfer'
        || (this.currentItem && this.currentItem.transaction_type_id === this.transferTypeId);
    },

    headerName() {
      if (this.isNewMode) {
        return this.isTransfer ? 'New Transfer' : 'New Transaction';
      }
      return `${this.name}`;
    },

    name() {
      if (!this.currentItem) {
        return '';
      }
      if (this.isStartingBalance) {
        return `Starting Balance | ${this.currentItem.category_name}`;
      }
      if (this.isTransfer) {
        return `${this.currentItem.category_name} to ${this.currentItem.transfer_category_name}`;
      }
      return `${this.currentItem.type_name} | ${this.currentItem.category_name}`;
    },

    isCause() {
      return this.$store.getters['Transactions/isCause'](this.form.transaction_type_id);
    },

    isLoan() {
      return this.$store.getters['Transactions/isLoan'](this.form.transaction_type_id);
    },

    isPikadon() {
      return this.$store.getters['Transactions/isPikadon'](this.form.transaction_type_id);
    },

    isPledge() {
      return this.$store.getters['Transactions/isPledge'](this.form.transaction_type_id);
    },

    isPledgePayment() {
      return this.$store.getters['Transactions/isPledgePayment'](this.form.transaction_type_id);
    },

    isStartingBalance() {
      return this.$store.getters['Transactions/isStartingBalance'](this.form.transaction_type_id);
    },

    isDistribution() {
      return this.form.transaction_type_id === 2;
    },

    isDebit() {
      if (this.isStartingBalance) {
        return this.form.debit_credit === 'debit';
      }
      return this.$store.getters['Transactions/isDebit'](this.form.transaction_type_id);
    },

    transferTypeId() {
      return this.$store.getters['TransactionTypes/transferTypeId'];
    },
  },

  methods: {
    newForm() {
      return {
        id: null,
        date: new Date(),
        transaction_type_id: 1,
        transaction_method_id: null,
        number: '',
        category_id: null,
        transfer_category_id: null,
        contact_id: null,
        debit_credit: 'credit',
        amount: null,
        note: '',
      };
    },

    async initForm() {
      if (this.$refs.observer) {
        this.$refs.observer.reset();
      }
      if (this.$refs.form) {
        this.$root.scrollUp(this.$refs.form);
      }
      this.form = this.newForm();
      if (!this.isNewMode && this.currentItem) {
        this.form = { ...this.form, ...this.currentItem };
        this.form.date = new Date(this.form.date);
        if (this.isStartingBalance) {
          this.form.debit_credit = this.form.amount < 0
            ? 'debit' : 'credit';
        }
        if (this.isDebit) {
          this.form.amount = Math.abs(this.form.amount);
        }
      }
      if (this.isTransfer) {
        this.form.transaction_type_id = this.transferTypeId;
      }
      await this.$store.dispatch('Categories/getStartingBalanceCategories', this.form.id || 0);
      if (!this.isNewMode && this.currentItem && this.isStartingBalance) {
        this.form.category_id = this.currentItem.category_id;
      }
    },

    async saveItem() {
      const result = await this.$store.dispatch('Transactions/addData', this.form);
      return result;
    },

    async updateItem() {
      const result = await this.$store.dispatch('Transactions/updateData', this.form);
      return result;
    },

    onTypeChange() {
      if (this.isPledge) {
        this.form.transaction_method_id = null;
        this.form.number = '';
      }
    },

    callNewForm() {
      if (this.isTransfer) {
        this.$emit('add-new-transfer');
      }
      this.$emit('add-new');
    },
  },
};
</script>

<style>

</style>