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
      <div class="flex-table__row w-shadow"
        @click="$emit('view', item)"
        :class="{'active': currentItem && currentItem.id === item.id}">
        <div class="flex-table__row-item col-2 font-weight-bold"
            tabindex="0">
            {{item.name}}
        </div>
        <div class="flex-table__row-item col-2"
            tabindex="0">
          <contact-name-field-component
            :company-name="item.contact_company_name"
            :first-name="item.contact_first_name"
            :last-name="item.contact_last_name"
          ></contact-name-field-component>
        </div>
        <div class="flex-table__row-item col-2"  tabindex="0">

        </div>
        <div class="flex-table__row-item col-2"  tabindex="0">

        </div>
        <div class="flex-table__row-item col-2"  tabindex="0">

        </div>
        <div class="flex-table__row-item col-2"  tabindex="0">

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
      sortOrderActionName: 'Causes/setSortOrder',
    };
  },

};
</script>

<style>

</style>