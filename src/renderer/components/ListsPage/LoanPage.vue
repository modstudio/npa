<template>
  <div>
    <loan-left-side-component
      v-model="searchText"
    ></loan-left-side-component>
    <div class="d-flex">
      <div class="flex-grow-1">
        {{data.length}} total
      </div>
      <button type="button" class="btn btn-secondary" @click="addItem">
        Add Loan
      </button>
    </div>
    <div class="flex-table">
      <div class="flex-table__header">
        <div class="flex-table__header-item col-3">
          Contact
        </div>
        <div class="flex-table__header-item col-3">
          Description
        </div>
        <div class="flex-table__header-item col-3">
          Metrics
        </div>
        <div class="flex-table__header-item col-3">
          Balance
        </div>                     
      </div>
      <div is="draggable" v-model="data" tag="div"
        handle=".list-components__item-move"
        @change="onSortChange">
        <div class="position-relative mb-2" v-for="item in data"
          :key="item.id">
          <span class="list-components__item-move">
            <i class="icon-move-dots"></i>
          </span>
          <div class="flex-table__row w-shadow"
            @click="viewItem(item)"
            :class="{'active': currentItem && currentItem.id === item.id}">
            <div class="flex-table__row-item col-3 font-weight-bold"
                tabindex="0">
                <contact-name-field-component
                  :company-name="item.contact_company_name"
                  :first-name="item.contact_first_name"
                  :last-name="item.contact_last_name"
                ></contact-name-field-component>
            </div>
            <div class="flex-table__row-item col-3"
                tabindex="0">
              {{item.description}}
            </div>
            <div class="flex-table__row-item col-3"
                tabindex="0">
            </div>
            <div class="flex-table__row-item col-3"
                tabindex="0">
            </div>                        
          </div>
        </div>
      </div>
    </div>      
    <loan-side-bar-component
      :current-item="currentItem"
      :is-shown="isViewPanel"
      :mode="viewPanelMode"
      @hidepanel="hidePanel"
      @update="getData"
      @add-new="addItem"
    ></loan-side-bar-component>         
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import SortOrderMixin from '../mixins/sort-order';
import LoanLeftSideComponent from './LoanPage/LoanLeftSideComponent';
import LoanSideBarComponent from './LoanPage/LoanSideBarComponent';
import ContactNameFieldComponent from '../common/ContactNameFieldComponent';

export default {
  components: {
    draggable,
    LoanLeftSideComponent,
    LoanSideBarComponent,
    ContactNameFieldComponent,
  },

  mixins: [SortOrderMixin],

  data() {
    return {
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      sortOrderActionName: 'Loans/setSortOrder',
    };
  },

  computed: {
    data: {
      get() {
        let { data } = this.$store.state.Loans;
        if (this.searchText) {
          const searchString = this.searchText.toLowerCase();
          data = data
            .filter(item => item.contact_company_name.toLowerCase().indexOf(searchString) !== -1
              || item.contact_first_name.toLowerCase().indexOf(searchString) !== -1
              || item.contact_last_name.toLowerCase().indexOf(searchString) !== -1
              || item.description.toLowerCase().indexOf(searchString) !== -1
              || (item.note && item.note.toLowerCase().indexOf(searchString) !== -1));
        }
        return data;
      },
      async set(data) {
        await this.$store.commit('Loans/setData', data);
      },
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('Loans/getData');
    },

    addItem() {
      this.currentItem = null;
      this.viewPanelMode = 'new';
      this.isViewPanel = true;
    },

    hidePanel() {
      this.isViewPanel = false;
      this.currentItem = null;
    },

    viewItem(item) {
      this.currentItem = item;
      this.viewPanelMode = 'edit';
      this.isViewPanel = true;
    },
  },
};
</script>

<style>

</style>