<template>
  <div class="flex-table__row flex-table__row--double w-shadow"
    @click="$emit('view')"
    :class="{'active': currentItem && currentItem.id === item.id}">
    <div class="flex-table__row-item col-2 font-weight-bold"
        tabindex="0">
      {{item.date}}
    </div>
    <div class="flex-table__row-item flex-column col-2"
        tabindex="0">
      <div>{{ item.type_name }}</div>
      <span class="subtext">{{ methodAndNumber }}</span>
    </div>
    <div class="flex-table__row-item flex-column col-2"
        tabindex="0">
      <template v-if="isCause">
        {{item.cause_name}}
      </template>
      <template v-else-if="isLoan">
        <div>{{item.loan_name}}</div>
        <span class="subtext">{{item.loan_description}}</span>
      </template>
      <template v-else-if="isPledge">
        <div>{{item.pledge_name}}</div>
        <span class="subtext">{{item.pledge_cause_name}}</span>
      </template>
    </div>
    <div class="flex-table__row-item col-2"
        tabindex="0">
      <contact-name-field-component
        :company-name="item.contact_company_name"
        :first-name="item.contact_first_name"
        :last-name="item.contact_last_name"
      ></contact-name-field-component>
    </div>
    <div class="flex-table__row-item col-2"
        tabindex="0">
      <span :class="amountClass">{{amountPrefix}}{{absAmount}}</span>
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
    absAmount() {
      return Math.abs(this.item.amount);
    },

    amountClass() {
      if (this.item.amount < 0) {
        return 'color-secondary-700';
      }
      if (this.item.amount > 0) {
        return 'color-primary-700';
      }
      return '';
    },

    amountPrefix() {
      return this.item.amount < 0 ? '-$' : '$';
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

    isCause() {
      return this.$store.getters['Transactions/isCause'](this.item.transaction_type_id);
    },

    isLoan() {
      return this.$store.getters['Transactions/isLoan'](this.item.transaction_type_id);
    },

    isPikadon() {
      return this.$store.getters['Transactions/isPikadon'](this.item.transaction_type_id);
    },

    isPledge() {
      return this.$store.getters['Transactions/isPledge'](this.item.transaction_type_id);
    },

    isDebit() {
      return this.$store.getters['Transactions/isDebit'](this.item.transaction_type_id);
    },

    isCredit() {
      return this.$store.getters['Transactions/isCredit'](this.item.transaction_type_id);
    },
  },
};
</script>

<style>

</style>