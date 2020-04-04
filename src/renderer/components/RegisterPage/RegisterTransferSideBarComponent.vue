<template>
  <div v-show="isShown">
    <right-side-bar-component
      header-image-url="./static/images/register.svg"
      header-image-style="background-size: auto;"
      init-event-name="open-register-page"
      @hidepanel="$emit('hidepanel')"
    >
      <template slot="header">{{ headerName }}</template>
      <template slot="headerBadge">{{ headerBadge }}</template>
      <div>
        <div class="info-sidebar__body" ref="form" v-show="!isDeleteMode">
            <div class="info-sidebar__block-header">
                <h4>Transfer</h4>
            </div>
            <ValidationObserver ref="observer">
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
                  :disable-currency-class="true"
                ></currency-input-component>
            </ValidationObserver>
        </div>

        <item-delete-dialog-component v-if="isDeleteMode"
          :item="currentItem"
          item-name="Transfer"
          store-action-name="Transactions/deleteTransfer"
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
import CategorySelectComponent from '../common/form-select-components/CategorySelectComponent';
import sideBarPanelMixin from '../mixins/side-bar-panel';

export default {
  components: {
    ItemDeleteDialogComponent,
    CategorySelectComponent,
  },

  mixins: [sideBarPanelMixin],

  computed: {
    isNewMode() {
      return this.mode === 'new';
    },

    headerName() {
      if (this.isNewMode) {
        return 'New Transfer';
      }
      return `${this.name}`;
    },

    headerBadge() {
      if (!this.currentItem) {
        return '';
      }
      if (this.currentItem.related_transaction_id) {
        return `${this.currentItem.related_transaction_id} | ${this.currentItem.id}`;
      }
      return `${this.currentItem.id} | ${this.currentItem.transfer_transaction_id}`;
    },

    name() {
      if (!this.currentItem) {
        return '';
      }
      return `${this.categoryFrom} to ${this.categoryTo}`;
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

    transferTypeId() {
      return this.$store.getters['TransactionTypes/transferTypeId'];
    },
  },

  methods: {
    newForm() {
      return {
        id: null,
        date: new Date(),
        transaction_type_id: this.transferTypeId,
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
      if (this.isNewMode) {
        this.form.transaction_type_id = this.transferTypeId;
      }
    },

    async saveItem() {
      const result = await this.$store.dispatch('Transactions/addTransfer', this.form);
      return result;
    },

    async updateItem() {
      const result = await this.$store.dispatch('Transactions/updateTransfer', this.form);
      return result;
    },

    callNewForm() {
      this.$emit('add-new');
    },
  },
};
</script>

<style>

</style>