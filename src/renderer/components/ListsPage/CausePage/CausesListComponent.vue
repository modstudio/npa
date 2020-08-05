<template>
  <div is="draggable" v-model="data" tag="div"
    class="ml-4 pl-2"
    handle=".list-components__item-move"

    @change="onSortChange">
    <div class="position-relative" v-for="item in data"
      :key="item.id">
      <span class="list-components__item-move" :class="{'d-none': isFiltered}">
          <i class="icon icon-drag"></i>
      </span>
      <div class="flex-table__row"
        @click="$emit('view', item)"
        :class="{'active': currentItem && currentItem.id === item.id}">
        <div class="flex-table__row-item flex-table__row-item--name"
            tabindex="0">
          <div class="flex-grow-1 d-flex align-items-center">
            <inactive-badge-component v-if="item.is_inactive"></inactive-badge-component>
            <contact-name-field-component
              :company-name="item.contact_company_name"
              :first-name="item.contact_first_name"
              :last-name="item.contact_last_name"
            ></contact-name-field-component>
          </div>
        </div>
        <div class="flex-grow-1 align-items-center d-flex">
          <div class="row flex-grow-1">
            <div class="flex-table__row-item col-4" tabindex="0">
                {{item.description}}
            </div>
            <div class="flex-table__row-item col-2"  tabindex="0">
              <div class="w-100 text-right pr-3">
                <amount-info-component :amount="item.metric_balance">
                </amount-info-component>
              </div>
            </div>
            <div class="flex-table__row-item col-4" tabindex="0">
              <div class="row flex-grow-1 pl-3">
                <div class="col-4">
                  <metric-info-component
                    metric-name="Raised"
                    :amount="item.metric_kredit"
                  ></metric-info-component>
                </div>
                <div class="col-4">
                  <metric-info-component
                    metric-name="Expenses"
                    :amount="item.metric_debit"
                  ></metric-info-component>
                </div>
                <div class="col-4">
                  <metric-info-component
                    metric-name="Distributed"
                    :amount="item.metric_distributed"
                  ></metric-info-component>
                </div>
              </div>

            </div>
            <div class="flex-table__row-item col-2"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ContactNameFieldComponent from '../../common/ContactNameFieldComponent';
import SortOrderMixin from '../../mixins/sort-order';

export default {
  props: {
    causeGroup: {
      type: Object,
      default: null,
    },
    isFiltered: {
      type: Boolean,
      default: false,
    },
    currentItem: {
      type: Object,
      default: null,
    },
  },

  components: {
    draggable,
    ContactNameFieldComponent,
  },

  mixins: [SortOrderMixin],

  computed: {
    data: {
      get() {
        return this.causeGroup.causes;
      },
      set(data) {
        this.causeGroup.causes = data;
      },
    },
  },

  data() {
    return {
      collapse: false,
      sortOrderActionName: 'Categories/setSortOrder',
    };
  },

};
</script>

<style>

</style>
