<template>
  <div class="m-4">
    <contact-left-side-bar-component
      v-model="searchText"
    ></contact-left-side-bar-component>
    <layouts-container-lg-component>
      <div class="d-flex">
        <div class="flex-grow-1">
          {{data.length}} total
        </div>
        <button type="button" class="btn btn-secondary" @click="addContact">
          Add contact
        </button>
      </div>
      <div class="flex-table">
        <div class="flex-table__header">
          <div class="flex-table__header-item col-4 sortable" ref="sortName"
            @click="setSortField('name')">
            NAME
            <i class="icon-down"></i>
          </div>
          <div class="flex-table__header-item col-4 sortable" ref="sortPhone_number"
          @click="setSortField('phone_number')">
            Phone Number
            <i class="icon-down"></i>
          </div>
          <div class="flex-table__header-item col-4 sortable" ref="sortAddress"
          @click="setSortField('address')">
            Address
            <i class="icon-down"></i>
          </div>          
        </div>
        <div class="position-relative mb-2" v-for="item in data"
          :key="item.id">
          <div class="flex-table__row w-shadow"
            @click="viewItem(item)"
            :class="{'active': currentItem && currentItem.id === item.id}">
            <div class="flex-table__row-item col-4 font-weight-bold"
                tabindex="0">
                <div v-if="item.company_name">
                  <div>{{ item.company_name }}</div>
                  <span class="subtext">{{ item.first_name }} {{ item.last_name }}</span>
                </div>
                <template v-else>
                  {{ item.first_name }} {{ item.last_name }}
                </template>
            </div>
            <div class="flex-table__row-item col-4"
                tabindex="0">
              {{ item.phone_number }}
            </div>
            <div class="flex-table__row-item col-4"
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
        @update-contacts="getData"
        @add-new="addContact"
      ></contact-side-bar-component>
    </layouts-container-lg-component>
  </div>
</template>

<script>
import ContactSideBarComponent from './ContactsPage/ContactSideBarComponent';
import ContactLeftSideBarComponent from './ContactsPage/ContactLeftSideBarComponent';
import bus from '../shared/EventBus';

const tableSortColumnMixin = require('./mixins/table-sort-column');
export default {
  components: {
    ContactSideBarComponent,
    ContactLeftSideBarComponent,
  },

  mixins: [
    tableSortColumnMixin,
  ],

  beforeRouteEnter(to, from, next) {
    next();
    bus.$emit('open-contacts-page');
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
    };
  },

  computed: {
    data() {
      let data = this.$store.state.Contacts.contacts;
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
        sortFields = ['company_name', 'first_name', 'last_name'];
        sortOrders = [this.sortOrder, this.sortOrder, this.sortOrder];
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
  },
};
</script>

<style>

</style>