<template>
  <div>
    <left-side-bar-component
      v-model="searchText"
      search-placeholder="Search Cause"
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
    <div class="d-flex">
      <div class="flex-grow-1">
        {{totalCauses}}
        <template v-if="isFiltered">results</template>
        <template v-else>total</template>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" @click="addGroup">
        Add Group
      </button>
      <button type="button" class="btn btn-secondary btn-sm ml-3" @click="addCause">
        Add Cause
      </button>
    </div>
    <div class="flex-table mt-3">
      <div class="flex-table__header">
          <div class="flex-table__header-item col-2">
              Recipient/Name
          </div>
          <div class="flex-table__header-item col-2">
              Description
          </div>
          <div class="flex-table__header-item col-6">
              Metrics
          </div>
          <div class="flex-table__header-item col-2">
            <div class="flex-grow-1">Balance</div>
            <div class="d-flex justify-content-end">
              <button class="btn btn-icon btn-icon--dark" @click="toggleAll">
                <i class="icon icon-Collapse-all" v-if="this.isAllExpanded">
                </i>
                <i class="icon icon-Epand-all" v-else>
                </i>
              </button>
            </div>
          </div>
      </div>
      <div is="draggable" v-model="causeGroups" tag="div"
          handle=".list-components__item-move"
          :disabled="isFiltered"
          @change="onSortChange">
          <div v-for="item in data"
                :key="item.id">
            <cause-group-row-component
              :item="item"
              :current-item="currentGroupItem"
              :is-filtered="isFiltered"
              @view-item="viewCauseGroup"
              @toggle-collapse="toggleCollapseStatus"
            ></cause-group-row-component>
            <b-collapse :id="`cause-group-${item.id}`" v-model="item.isExpanded">
              <causes-list-component
                :cause-group="item"
                :current-item="currentCauseItem"
                :is-filtered="isFiltered"
                @view="viewCause"
              ></causes-list-component>
            </b-collapse>
          </div>
      </div>
    </div>

    <no-result-found-component v-show="isFiltered && !totalCauses"></no-result-found-component>

    <cause-group-side-bar-component
      :current-item="currentGroupItem"
      :is-shown="isViewGroupPanel"
      :mode="viewGroupPanelMode"
      @hidepanel="hideGroupPanel"
      @update="onUpdate"
      @add-new="addGroup"
    ></cause-group-side-bar-component>
    <cause-side-bar-component
      :current-item="currentCauseItem"
      :is-shown="isViewCausePanel"
      :mode="viewCausePanelMode"
      @hidepanel="hideCausePanel"
      @update="onUpdate"
      @add-new="addCause"
      @add-new-contact="showContactForm"
    ></cause-side-bar-component>

    <contact-side-bar-component
      :is-shown="isViewContactForm"
      mode="dialog-add-new"
      @hidepanel="hideContactForm"
      @update="onUpdateContact"
    ></contact-side-bar-component>    
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import SortOrderMixin from '../mixins/sort-order';
import CauseGroupSideBarComponent from './CausePage/CauseGroupSideBarComponent';
import CauseSideBarComponent from './CausePage/CauseSideBarComponent';
import CauseGroupRowComponent from './CausePage/CauseGroupRowComponent';
import CausesListComponent from './CausePage/CausesListComponent';
import Bus from '../../shared/EventBus';
import ContactSideBarComponent from '../ContactsPage/ContactSideBarComponent';
import addNewContactMixin from '../mixins/add-new-contact';

export default {
  components: {
    draggable,
    CauseGroupSideBarComponent,
    CauseSideBarComponent,
    CauseGroupRowComponent,
    CausesListComponent,
    ContactSideBarComponent,
  },

  mixins: [
    SortOrderMixin,
    addNewContactMixin,
  ],

  activated() {
    Bus.$emit('open-cause-page');
    this.isActivePage = true;
  },

  deactivated() {
    this.isActivePage = false;
  },

  data() {
    return {
      isActivePage: false,
      isViewGroupPanel: false,
      viewGroupPanelMode: 'edit',
      currentGroupItem: null,
      isViewCausePanel: false,
      viewCausePanelMode: 'edit',
      currentCauseItem: null,
      searchText: '',
      sortOrderActionName: 'CauseGroups/setSortOrder',
      causeGroups: [],
      collapseStatusBeforeFilter: null,
      inactiveFilter: 0,
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchText || this.inactiveFilter !== 0;
    },

    totalCauses() {
      return this.data.reduce((prev, current) => (current.causes.length + prev), 0);
    },

    data() {
      let data = this.causeGroups;
      if (this.inactiveFilter === 0) {
        data = data.map(item => ({
          ...item,
          causes: item.causes.filter(cause => cause.is_inactive === 0),
        }));
        data = data.filter(item => item.is_inactive === 0 || item.causes.length);
      } else if (this.inactiveFilter === 2) {
        data = data.map(item => ({
          ...item,
          causes: item.causes.filter(cause => cause.is_inactive === 1),
        }));
        data = data.filter(item => item.is_inactive === 1 || item.causes.length);
      }
      if (this.searchText) {
        const searchString = this.searchText.toLowerCase();
        return data
          .map(item => ({
            ...item,
            causes: item.causes
              .filter(cause => cause.name.toLowerCase().indexOf(searchString) !== -1
                || cause.contact_company_name.toLowerCase().indexOf(searchString) !== -1
                || cause.contact_first_name.toLowerCase().indexOf(searchString) !== -1
                || cause.contact_last_name.toLowerCase().indexOf(searchString) !== -1),
            isExpanded: item.isExpanded,
          }))
          .filter(item => item.name.toLowerCase().indexOf(searchString) !== -1
            || item.note.toLowerCase().indexOf(searchString) !== -1
            || item.causes.length);
      }
      return data;
    },

    isAllCollapsed() {
      return !this.data.some(item => item.isExpanded && item.causes.length);
    },

    isAllExpanded() {
      return this.data.every(item => item.isExpanded || !item.causes.length);
    },
  },

  created() {
    this.getData();
    Bus.$on('db-restored', this.getData);
  },

  destroyed() {
    Bus.$off('db-restored', this.getData);
  },

  methods: {
    async getData() {
      const expandedIds = this.causeGroups
        .filter(item => item.isExpanded)
        .map(item => item.id);
      await this.$store.dispatch('Categories/getData');
      await this.$store.dispatch('CauseGroups/getData');
      this.causeGroups = this.$store.state.CauseGroups.data
        .map(item => ({
          ...item,
          causes: this.$store.getters['Categories/getCauses']
            .filter(cause => cause.category_group_id === item.id),
          isExpanded: expandedIds.includes(item.id),
        }));
    },

    addGroup() {
      this.hideCausePanel();
      this.currentGroupItem = null;
      this.viewGroupPanelMode = 'new';
      this.isViewGroupPanel = true;
    },

    viewCauseGroup(item) {
      this.hideContactForm();
      this.hideCausePanel();
      this.currentGroupItem = item;
      this.viewGroupPanelMode = 'edit';
      this.isViewGroupPanel = true;
    },

    hideGroupPanel() {
      this.isViewGroupPanel = false;
      this.currentGroupItem = null;
    },

    addCause() {
      this.hideGroupPanel();
      this.currentCauseItem = null;
      this.viewCausePanelMode = 'new';
      this.isViewCausePanel = true;
    },

    viewCause(item) {
      this.hideContactForm();
      this.hideGroupPanel();
      this.currentCauseItem = item;
      this.viewCausePanelMode = 'edit';
      this.isViewCausePanel = true;
    },

    hideCausePanel() {
      this.isViewCausePanel = false;
      this.currentCauseItem = null;
    },

    toggleAll() {
      const isAll = this.isAllCollapsed || this.isAllExpanded;
      this.data
        .filter(item => item.causes.length)
        .forEach((item) => {
          if (isAll || !item.isExpanded) {
            this.toggleCollapseStatus(item);
          }
        });
    },

    onFilterData() {
      if (this.isFiltered && !this.collapseStatusBeforeFilter) {
        this.saveCollapseStatus();
      } else if (!this.isFiltered && this.collapseStatusBeforeFilter) {
        this.restoreCollapseStatus();
      }
      if (this.isFiltered && !this.isAllExpanded) {
        this.expandAllItems();
      }
    },

    saveCollapseStatus() {
      this.collapseStatusBeforeFilter = this.causeGroups
        .filter(item => item.isExpanded)
        .map(item => item.id);
    },

    restoreCollapseStatus() {
      if (this.collapseStatusBeforeFilter) {
        this.causeGroups.forEach((item) => {
          item.isExpanded = this.collapseStatusBeforeFilter.includes(item.id);
        });
        this.collapseStatusBeforeFilter = null;
      }
    },

    expandAllItems() {
      this.data
        .filter(item => item.causes.length)
        .forEach((item) => {
          if (!item.isExpanded) {
            this.toggleCollapseStatus(item);
          }
        });
    },

    toggleCollapseStatus(item) {
      const index = _.findIndex(this.causeGroups, { id: item.id });
      if (index !== -1) {
        this.causeGroups[index].isExpanded = !item.isExpanded;
      }
    },

    onUpdate() {
      this.getData();
      Bus.$emit('update-category');
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
