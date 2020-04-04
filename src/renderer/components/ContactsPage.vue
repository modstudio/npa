<template>
  <div>
    <left-side-bar-component
      v-model="searchText"
      search-placeholder="Search Contacts"
      :is-filtered="isFiltered"
      @resetfilter="resetFilter"
    >
      <inactive-filter-component
        v-model="inactiveFilter"
      ></inactive-filter-component> 
    </left-side-bar-component>    
    <layouts-container-lg-component>
      <div class="d-flex align-items-center mb-4 pb-2">
        <div class="flex-grow-1">
          {{data.length}} 
          <template v-if="isFiltered">results</template>
          <template v-else>total</template>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" @click="addContact">
          Add contact
        </button>
      </div>
      <div class="flex-table">
        <div class="flex-table__header">
          <div class="flex-table__header-item col-3 sortable" ref="sortName"
            @click="setSortField('name')">
            NAME
            <i class="icon icon-triangle-down"></i>
          </div>
          <div class="flex-table__header-item col-3 sortable" ref="sortPhone_number"
          @click="setSortField('phone_number')">
            Phone Number
            <i class="icon icon-triangle-down"></i>
          </div>
          <div class="flex-table__header-item col-5 sortable" ref="sortAddress"
          @click="setSortField('address')">
            Address
            <i class="icon icon-triangle-down"></i>
          </div>
        </div>
        <div class="position-relative" v-for="item in data"
          :key="item.id">
          <div class="flex-table__row"
            @click="viewItem(item)"
            :class="{'active': currentItem && currentItem.id === item.id}">
            <div class="flex-table__row-item col-3"
                tabindex="0">
                <div class="flex-grow-1">
                  <div v-if="item.company_name">
                    <div>
                      {{ item.company_name }}
                    </div>
                    <span class="subtext">{{ item.first_name }} {{ item.last_name }}</span>
                  </div>
                  <template v-else>
                    {{ item.first_name }} {{ item.last_name }}
                  </template>
                </div>
                <inactive-badge-component v-if="item.is_inactive"></inactive-badge-component>
            </div>
            <div class="flex-table__row-item col-3"
                tabindex="0">
              {{ item.phone_number }}
            </div>
            <div class="flex-table__row-item col-6"
                tabindex="0">
              {{ item.address }}
            </div>
          </div>
        </div>
      </div>
      <contact-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="onUpdateContact"
        @add-new="addContact"
      ></contact-side-bar-component>
    </layouts-container-lg-component>
  </div>
</template>

<script>
import ContactSideBarComponent from './ContactsPage/ContactSideBarComponent';
import Bus from '../shared/EventBus';

const tableSortColumnMixin = require('./mixins/table-sort-column');
export default {
  components: {
    ContactSideBarComponent,
  },

  mixins: [
    tableSortColumnMixin,
  ],

  beforeRouteEnter(to, from, next) {
    next();
    Bus.$emit('open-contacts-page');
  },

  data() {
    return {
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      refNameSortCol: ['sortName', 'sortPhone_number', 'sortAddress'],
      sortField: 'name',
      sortOrder: 'asc',
      inactiveFilter: 0,
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchText || this.inactiveFilter !== 0;
    },
    data() {
      let data = this.$store.state.Contacts.contacts;
      if (this.inactiveFilter === 0) {
        data = data.filter(item => item.is_inactive === 0);
      } else if (this.inactiveFilter === 2) {
        data = data.filter(item => item.is_inactive === 1);
      }
      if (this.searchText) {
        const searchString = this.searchText.toLowerCase();
        data = data
          .filter(contact => contact.company_name.toLowerCase().indexOf(searchString) !== -1
            || contact.first_name.toLowerCase().indexOf(searchString) !== -1
            || contact.last_name.toLowerCase().indexOf(searchString) !== -1
            || contact.phone_number.toLowerCase().indexOf(searchString) !== -1
            || contact.address.toLowerCase().indexOf(searchString) !== -1);
      }
      let sortFields = [this.sortField];
      let sortOrders = [this.sortOrder];
      if (this.sortField === 'name') {
        sortFields = [function (item) {
          return item.company_name ? item.company_name
            : `${item.first_name} ${item.last_name}`;
        }];
        sortOrders = [this.sortOrder];
      }

      return _.orderBy(data, sortFields, sortOrders);
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('Contacts/getData');
    },

    addContact() {
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

    onUpdateContact() {
      this.getData();
      this.$store.dispatch('Categories/getData');
      Bus.$emit('update-contacts');
    },

    resetFilter() {
      this.searchText = '';
      this.inactiveFilter = 0;
    },
  },
};
</script>

<style>

</style>
