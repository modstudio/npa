<template>
  <div class="flex-table__row flex-table__row--double w-shadow"
    @click="$emit('view')"
    :class="{'active': currentItem && currentItem.id === item.id}">
    <div class="flex-table__row-item col-2"
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
        <div>
          {{item.category_name}}
          <amount-info-component v-if="isTransfer"
            :amount="-item.amount"
          ></amount-info-component>
        </div>
        <span class="subtext" v-if="isTransfer">From</span>
        <span class="subtext" v-else>{{item.category_description}}</span>     
    </div>
    <div class="flex-table__row-item flex-column col-2"
        tabindex="0">
      <template v-if="isTransfer">
        <div>
          {{item.transfer_category_name}}
          <amount-info-component
            :amount="item.amount"
          ></amount-info-component>
        </div>
        <span class="subtext">To</span>
      </template>
      <contact-name-field-component v-else
        :company-name="item.contact_company_name"
        :first-name="item.contact_first_name"
        :last-name="item.contact_last_name"
      ></contact-name-field-component>
    </div>
    <div class="flex-table__row-item col-2"
        tabindex="0">
      <amount-info-component v-if="!isTransfer"
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
  },
};
</script>

<style>

</style>