<template>
  <div class="flex-table__row flex-table__row--double w-shadow"
    @click="$emit('view')"
    :class="{'active': isActiveRow}">
    <div class="flex-table__row-item col-2"
        tabindex="0">
      {{item.date}}
    </div>
    <div class="flex-table__row-item flex-column col-2"
        tabindex="0">
      <div>{{ item.type_name }}</div>
      <template v-if=isTransfer>
        <span class="subtext" v-if="item.transfer_transaction_id">
          To {{item.transfer_transation_category_name}}{{toTransactionSubtext}}
        </span>
        <span class="subtext" v-else>
          From {{item.related_transaction_category_name}}{{fromTransactionSubtext}}
        </span>
      </template>
      <span class="subtext" v-else>{{ methodAndNumber }}</span>
    </div>
    <div class="flex-table__row-item flex-column col-2"
        tabindex="0">
        <div>
          {{item.category_name}}
        </div>
        <span class="subtext" v-if="isPledge">{{item.related_category_name}}</span>
        <span class="subtext">{{item.category_description}}</span>     
    </div>
    <div class="flex-table__row-item flex-column col-2"
        tabindex="0">
      <contact-name-field-component
        :company-name="item.contact_company_name"
        :first-name="item.contact_first_name"
        :last-name="item.contact_last_name"
      ></contact-name-field-component>
    </div>
    <div class="flex-table__row-item col-2"
        tabindex="0">
      <amount-info-component
        :amount="item.amount"
      ></amount-info-component>
    </div>
    <div class="flex-table__row-item col-2 text-wrap"
        tabindex="0">
      {{ item.note }}
    </div>                                               
  </div>
</template>

<script>
import ContactNameFieldComponent from '../common/ContactNameFieldComponent';

export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
    currentItem: {
      type: Object,
      default: null,
    },
  },

  components: {
    ContactNameFieldComponent,
  },

  computed: {
    isActiveRow() {
      return this.currentItem && (this.currentItem.id === this.item.id
        || this.currentItem.id === this.item.related_transaction_id
        || this.currentItem.related_transaction_id === this.item.id);
    },

    methodAndNumber() {
      const words = [];
      if (this.item.method_name) {
        words.push(this.item.method_name);
      }
      if (this.item.number) {
        words.push(this.item.number);
      }
      return words.join(' | ');
    },

    transferTypeId() {
      return this.$store.getters['TransactionTypes/transferTypeId'];
    },

    isTransfer() {
      return this.item.transaction_type_id === this.transferTypeId;
    },

    isPledge() {
      return this.item.category_type_id === 2;
    },

    fromTransactionSubtext() {
      if (this.item.related_transaction_category_type_id === 3) {
        return `, ${this.item.related_transaction_category_description}`;
      }
      if (this.item.related_transaction_category_type_id === 2) {
        return `, ${this.item.related_transaction_related_category_name}`;
      }
      return '';
    },

    toTransactionSubtext() {
      if (this.item.transfer_transaction_category_type_id === 3) {
        return `, ${this.item.transfer_transaction_category_description}`;
      }
      if (this.item.transfer_transaction_category_type_id === 2) {
        return `, ${this.item.transfer_transaction_related_category_name}`;
      }
      return '';
    },
  },
};
</script>

<style>

</style>