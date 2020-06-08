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
              <button type="button" class="btn btn-sm" v-if="!isNewMode"
                @click="duplicate"
              >
                <img class="mr-2" src="static/images/copy.svg">
                Duplicate
              </button> 
            </div>
            <ValidationObserver ref="observer">
              <!-- Date -->
              <datepicker-component
                v-model="form.date"
                label="Date"
                rules="required"
              ></datepicker-component>
              <!-- Transaction type -->
              <transaction-type-select-component v-show="isNewMode || !isTransfer"
                v-model="form.transaction_type_id"
                rules="required"
                @change="onTypeChange"
              ></transaction-type-select-component>

              <!-- Transfer -->
              <template v-if="isTransfer">
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
                  rules="required|is_not:0.00"
                  :disable-currency-class="true"
                ></currency-input-component>
              </template>
              <!-- End Transfer -->

              <!-- Other types of transaction -->
              <template v-else>
                <div class="row gutter-8" v-if="(isPledgePayment || !isPledge) && !isStartingBalance && !isDeposit && !isAdjustment">
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
                      :rules="{required: isRequredNumber}"
                      label="Number"
                    ></text-input-component>
                  </div>
                </div>
                <div v-show="!isDeposit">
                  <!-- Cause -->
                  <cause-select-component
                    v-if="isCause"
                    v-model="form.category_id"
                    label="Category"
                    rules="required"
                    @add-new="onAddNewCause"
                  ></cause-select-component>
                  <!-- Loan -->
                  <loan-select-component
                    v-if="isLoan"
                    v-model="form.category_id"
                    label="Category"
                    rules="required"
                    @add-new="onAddNewLoan"
                  ></loan-select-component>
                  <!-- Pikadon -->
                  <pikadon-select-component
                    v-if="isPikadon"
                    v-model="form.category_id"
                    label="Category"
                    rules="required"
                    @add-new="onAddNewPikadon"
                  ></pikadon-select-component>
                  <!-- Pledge -->
                  <pledge-select-component
                    v-if="isPledge"
                    v-model="form.category_id"
                    label="Category"
                    rules="required"
                    @add-new="onAddNewPledge"
                  ></pledge-select-component>
                  <!-- General Donation -->
                  <general-donation-select-component
                    v-if="isGeneralDonation"
                    v-model="form.category_id"
                    label="Category"
                    rules="required"
                    @add-new="onAddNewGeneralDonation"
                  ></general-donation-select-component>
                  <!-- Starting Balance -->
                  <starting-balance-category-select-component
                    v-if="isStartingBalance"
                    v-model="form.category_id"
                    label="Category"
                    rules="required"
                  ></starting-balance-category-select-component>
                  <!-- Adjustment -->
                  <category-select-component
                    v-if="isAdjustment"
                    v-model="form.category_id"
                    label="Category"
                    rules="required"
                  ></category-select-component>
                  <!-- Debit/Credit -->
                  <debit-credit-component
                    v-if="isStartingBalance"
                    label="Starting Balance (+/-)"
                    v-model="form.debit_credit"
                  ></debit-credit-component>
                  <!-- Debit/Credit -->
                  <debit-credit-component
                    v-if="isAdjustment"
                    label="Adjustment (+/-)"
                    v-model="form.debit_credit"
                  ></debit-credit-component>
                  <!-- Payee -->
                  <contact-select-component
                    v-if="!isPledge && !isStartingBalance && !isAdjustment"
                    v-model="form.contact_id"
                    label="Payee"
                    :rules="{required: isDistribution}"
                    @add-new="onAddNewContact"
                  ></contact-select-component>
                </div>
                <!-- Amount -->
                <currency-input-component
                  v-model="form.amount"
                  label="Amount"
                  rules="required|is_not:0.00"
                  :is-debit="isDebit"
                ></currency-input-component>
                <!-- Exclude from full export -->
                <checkbox-component v-show="!isDebit && !isAdjustment && !isDeposit"
                  v-model="form.is_deposit"
                  label="Is a deposit"
                ></checkbox-component> 
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
          :store-action-name="deleteActionName"
          check-action-name=""
          :has-association="false"
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
          :has-association="false"
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
import TransactionTypeSelectComponent from '../common/form-select-components/TransactionTypeSelectComponent';
import TrxMethodSelectComponent from '../common/form-select-components/TrxMethodSelectComponent';
import CauseSelectComponent from '../common/form-select-components/CauseSelectComponent';
import LoanSelectComponent from '../common/form-select-components/LoanSelectComponent';
import PikadonSelectComponent from '../common/form-select-components/PikadonSelectComponent';
import PledgeSelectComponent from '../common/form-select-components/PledgeSelectComponent';
import ContactSelectComponent from '../common/form-select-components/ContactSelectComponent';
import GeneralDonationSelectComponent from '../common/form-select-components/GeneralDonationSelectComponent';
import StartingBalanceCategorySelectComponent from '../common/form-select-components/StartingBalanceCategorySelectComponent';
import CategorySelectComponent from '../common/form-select-components/CategorySelectComponent';
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
    GeneralDonationSelectComponent,
    ContactSelectComponent,
    StartingBalanceCategorySelectComponent,
    CategorySelectComponent,
    DebitCreditComponent,
  },

  mixins: [sideBarPanelMixin],

  computed: {
    isNewMode() {
      return this.mode === 'new' || this.mode === 'duplicate';
    },

    headerName() {
      if (this.isNewMode) {
        return 'New Transaction';
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

    isGeneralDonation() {
      return this.$store.getters['Transactions/isGeneralDonation'](this.form.transaction_type_id);
    },

    isAdjustment() {
      return this.$store.getters['Transactions/isAdjustment'](this.form.transaction_type_id);
    },

    isDeposit() {
      return this.$store.getters['Transactions/isDeposit'](this.form.transaction_type_id);
    },

    isTransfer() {
      return this.$store.getters['Transactions/isTransfer'](this.form.transaction_type_id);
    },

    isDistribution() {
      return this.form.transaction_type_id === 2;
    },

    isDebit() {
      if (this.isStartingBalance || this.isAdjustment) {
        return this.form.debit_credit === 'debit';
      }
      return this.$store.getters['Transactions/isDebit'](this.form.transaction_type_id);
    },

    isRequredNumber() {
      if (!this.form.transaction_method_id) {
        return false;
      }
      const method = this.$store.getters['TrxMethods/getItem'](this.form.transaction_method_id);
      if (method) {
        return method.number_required === 1;
      }
      return false;
    },

    categoryFrom() {
      if (!this.currentItem) {
        return '';
      }
      if (this.currentItem.related_transaction_id) {
        const category = this.$store.getters['Categories/category'](this.currentItem.related_transaction_category_id);
        return category ? category.category_name : '';
      }
      return this.currentItem.category_name;
    },

    categoryTo() {
      if (!this.currentItem) {
        return '';
      }
      if (this.currentItem.transfer_transaction_id) {
        const category = this.$store.getters['Categories/category'](this.currentItem.transfer_transaction_category_id);
        return category ? category.category_name : '';
      }
      return this.currentItem.category_name;
    },

    deleteActionName() {
      return this.isTransfer ? 'Transactions/deleteTransfer' : 'Transactions/deleteItem';
    },
  },

  methods: {
    newForm() {
      return {
        id: null,
        date: moment().toDate(),
        transaction_type_id: 1,
        transaction_method_id: null,
        number: '',
        category_id: null,
        contact_id: null,
        debit_credit: 'credit',
        amount: null,
        is_deposit: 0,
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
      if ((!this.isNewMode || this.mode === 'duplicate') && this.currentItem) {
        this.form = { ...this.form, ...this.currentItem };
        this.form.date = moment(this.form.date).toDate();
        if (this.isStartingBalance || this.isAdjustment) {
          this.form.debit_credit = this.form.amount < 0
            ? 'debit' : 'credit';
        }

        if (this.isTransfer) {
          if (this.currentItem.related_transaction_id) {
            // If we have Transaction To
            this.form.transfer_category_id = this.form.category_id;
            this.form.category_id = this.currentItem.related_transaction_category_id;
          } else {
            // If we have transaction From
            this.form.amount = -this.form.amount;
            this.form.transfer_category_id = this.currentItem.transfer_transaction_category_id;
          }
        }

        if (this.isDebit) {
          this.form.amount = Math.abs(this.form.amount);
        }
        this.form.amount = this.$root.formatterAmount.format(this.form.amount);
      }
      await this.$store.dispatch('Categories/getStartingBalanceCategories', this.form.id || 0);
      if (!this.isNewMode && this.currentItem && this.isStartingBalance) {
        this.form.category_id = this.currentItem.category_id;
      }
    },

    async saveItem() {
      if (!this.isTransfer) {
        const result = await this.$store.dispatch('Transactions/addData', this.form);
        return result;
      }
      const result = await this.$store.dispatch('Transactions/addTransfer', this.form);
      return result;
    },

    async updateItem() {
      if (!this.isTransfer) {
        const result = await this.$store.dispatch('Transactions/updateData', this.form);
        return result;
      }
      const result = await this.$store.dispatch('Transactions/updateTransfer', this.form);
      return result;
    },

    onTypeChange() {
      if (this.isPledge) {
        this.form.transaction_method_id = null;
        this.form.number = '';
      } else if (this.isDeposit) {
        this.form.transaction_method_id = null;
        this.form.number = '';
        this.form.category_id = null;
        this.form.contact_id = null;
      }
    },

    callNewForm() {
      this.$emit('add-new');
    },

    duplicate() {
      this.$emit('duplicate');
    },

    onAddNewContact() {
      this.$emit('add-new-contact', (id) => {
        this.form.contact_id = id;
      });
    },

    onAddNewCause() {
      this.$emit('add-new-cause', (id) => {
        this.form.category_id = id;
      });
    },

    onAddNewPledge() {
      this.$emit('add-new-pledge', (id) => {
        this.form.category_id = id;
      });
    },

    onAddNewLoan() {
      this.$emit('add-new-loan', (id) => {
        this.form.category_id = id;
      });
    },

    onAddNewPikadon() {
      this.$emit('add-new-pikadon', (id) => {
        this.form.category_id = id;
      });
    },

    onAddNewGeneralDonation() {
      this.$emit('add-new-general-donation', (id) => {
        this.form.category_id = id;
      });
    },
  },
};
</script>

<style>

</style>