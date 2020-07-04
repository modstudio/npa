<template>
  <div>
    <left-side-bar-component
      v-model="searchText"
      search-placeholder="Search Contacts"
      :is-filtered="isFiltered"
      @resetfilter="resetFilter"
    >
      <div class="px-4">
        <inactive-filter-component
          v-if="isActivePage"
          v-model="inactiveFilter"
        ></inactive-filter-component>
      </div>
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
          <div class="flex-table__header-item col-3 sortable" ref="sortAddress"
            @click="setSortField('address')">
            Address
            <i class="icon icon-triangle-down"></i>
          </div>
          <div class="flex-table__header-item col-3 sortable" ref="sortCity"
            @click="setSortField('city')">
            City
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
            <div class="flex-table__row-item col-3"
                tabindex="0">
              {{ item.address }}
            </div>
            <div class="flex-table__row-item col-3 flex-column align-items-start justify-content-center"
                tabindex="0">
              <div class="font-weight-bold">{{ item.city }}</div>
              <div>
                <span v-if="item.state">{{ item.state}},</span>
                <span v-if="item.zip">{{item.zip}},</span>
                <span>{{item.country}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <no-result-found-component v-show="isFiltered && !data.length"></no-result-found-component>
      
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

  activated() {
    this.isActivePage = true;
    Bus.$emit('open-contacts-page');
  },

  deactivated() {
    this.isActivePage = false;
  },

  data() {
    return {
      isActivePage: false,
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      refNameSortCol: ['sortName', 'sortPhone_number', 'sortAddress', 'sortCity'],
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
            || contact.address.toLowerCase().indexOf(searchString) !== -1
            || (contact.city && contact.city.toLowerCase().indexOf(searchString) !== -1)
            || (contact.state && contact.state.toLowerCase().indexOf(searchString) !== -1)
            || (contact.zip && contact.zip.toLowerCase().indexOf(searchString) !== -1));
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
    Bus.$on('show-settings', this.hidePanel);
  },

  destroyed() {
    Bus.$off('show-settings', this.hidePanel);
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
