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
        <div>{{item.category_name}}</div>
        <span class="subtext">{{item.category_description}}</span>     
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
  },
};
</script>

<style>

</style>