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
              <h4>Transaction</h4>
          </div>
            <ValidationObserver ref="observer">
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
                v-model="form.cause_id"
                label="Category"
                rules="required"
              ></cause-select-component>
              <!-- Loan -->
              <loan-select-component
                v-if="isLoan"
                v-model="form.loan_id"
                label="Category"
                rules="required"
              ></loan-select-component>
              <!-- Pikadon -->
              <pikadon-select-component
                v-if="isPikadon"
                v-model="form.pikadon_id"
                label="Category"
                rules="required"
              ></pikadon-select-component>
              <!-- Pledge -->
              <pledge-select-component
                v-if="isPledge"
                v-model="form.pledge_id"
                label="Category"
                rules="required"
              ></pledge-select-component>
              <!-- Starting Balance -->
              <starting-balance-category-select-component
                v-if="isStartingBalance"
                :value="startingBalanceCategoryId"
                label="Category"
                rules="required"
                @input="onStartingbalanceCategoryInput"
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
    DebitCreditComponent,
  },

  mixins: [sideBarPanelMixin],

  computed: {
    headerName() {
      return this.isNewMode ? 'New Transaction' : `${this.name}`;
    },

    name() {
      if (!this.currentItem) {
        return '';
      }
      if (this.isStartingBalance) {
        if (this.currentItem.cause_id) {
          return this.currentItem.cause_name;
        } else if (this.currentItem.loan_id) {
          return this.currentItem.loan_name;
        } else if (this.currentItem.pikadon_id) {
          return this.currentItem.pikadon_name;
        }
        return this.currentItem.pledge_name;
      }
      if (this.currentItem.contact_company_name) {
        return this.currentItem.contact_company_name;
      }
      return `${this.currentItem.contact_first_name} ${this.currentItem.contact_last_name}`;
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

    isCredit() {
      return this.$store.getters['Transactions/isCredit'](this.form.transaction_type_id);
    },

    startingBalanceCategoryId() {
      if (!this.isStartingBalance) {
        return null;
      }
      if (this.form.cause_id) {
        return `cause_id:${this.form.cause_id}`;
      }
      if (this.form.loan_id) {
        return `loan_id:${this.form.loan_id}`;
      }
      if (this.form.pikadon_id) {
        return `pikadon_id:${this.form.pikadon_id}`;
      }
      if (this.form.pledge_id) {
        return `pledge_id:${this.form.pledge_id}`;
      }
      return null;
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
        cause_id: null,
        loan_id: null,
        pikadon_id: null,
        pledge_id: null,
        contact_id: null,
        debit_credit: 'credit',
        amount: null,
        note: '',
      };
    },

    initForm() {
      if (this.$refs.observer) {
        this.$refs.observer.reset();
      }
      if (this.$refs.form) {
        this.$root.scrollUp(this.$refs.form);
      }
      this.form = this.newForm();
      if (!this.isNewMode && this.currentItem) {
        this.form = { ...this.currentItem };
        this.form.date = new Date(this.form.date);
        if (this.isDebit) {
          this.form.amount = Math.abs(this.form.amount);
        }
      }
      this.$store.dispatch('StartingBalanceCategories/getData', this.form.id || 0);
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
      if (this.isCause) {
        this.form.loan_id = null;
        this.form.pikadon_id = null;
        this.form.pledge_id = null;
      } else if (this.isLoan) {
        this.form.cause_id = null;
        this.form.pikadon_id = null;
        this.form.pledge_id = null;
      } else if (this.isPikadon) {
        this.form.cause_id = null;
        this.form.loan_id = null;
        this.form.pledge_id = null;
      } else if (this.isPledge) {
        this.form.cause_id = null;
        this.form.loan_id = null;
        this.form.pikadon_id = null;
        this.form.transaction_method_id = null;
        this.form.number = '';
      }
    },

    onStartingbalanceCategoryInput(value) {
      this.form.cause_id = null;
      this.form.loan_id = null;
      this.form.pikadon_id = null;
      this.form.pledge_id = null;
      const [fieldName, fieldVal] = value.split(':');
      this.form[fieldName] = fieldVal;
    },
  },
};
</script>

<style>

</style>