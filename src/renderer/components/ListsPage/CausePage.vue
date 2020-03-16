<template>
  <div>
    <cause-left-side-component
      v-model="searchText"
      @input="onFilterData"
    ></cause-left-side-component>
    <div class="d-flex">
      <div class="flex-grow-1">
        {{totalCauses}} total
      </div>
      <button type="button" class="btn btn-secondary" @click="addGroup">
        Add Group
      </button>
      <button type="button" class="btn btn-secondary ml-3" @click="addCause">
        Add Cause
      </button>
    </div>
    <div class="flex-table mt-3">
      <div class="flex-table__header">
          <div class="flex-table__header-item col-2">
              Name
          </div>
          <div class="flex-table__header-item col-2">
              Recipient
          </div>
          <div class="flex-table__header-item col-4">
              Metrics
          </div>
          <div class="flex-table__header-item col-2">
              Balance
          </div>          
          <div class="flex-table__row-item col-4 col-md-2 d-flex justify-content-end pr-2">
            <button class="btn btn-icon btn-icon--dark" @click="toggleAll">
              <i class="icon-minuses" v-if="this.isAllExpanded">
              </i>
              <i class="icon-pluses" v-else>
              </i>
            </button>
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

    <cause-group-side-bar-component
      :current-item="currentGroupItem"
      :is-shown="isViewGroupPanel"
      :mode="viewGroupPanelMode"
      @hidepanel="hideGroupPanel"
      @update="getData"
      @add-new="addGroup"
    ></cause-group-side-bar-component>
    <cause-side-bar-component
      :current-item="currentCauseItem"
      :is-shown="isViewCausePanel"
      :mode="viewCausePanelMode"
      @hidepanel="hideCausePanel"
      @update="getData"
      @add-new="addCause"
    ></cause-side-bar-component>    
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import SortOrderMixin from '../mixins/sort-order';
import CauseLeftSideComponent from './CausePage/CauseLeftSideComponent';
import CauseGroupSideBarComponent from './CausePage/CauseGroupSideBarComponent';
import CauseSideBarComponent from './CausePage/CauseSideBarComponent';
import CauseGroupRowComponent from './CausePage/CauseGroupRowComponent';
import CausesListComponent from './CausePage/CausesListComponent';
import Bus from '../../shared/EventBus';

export default {
  components: {
    draggable,
    CauseLeftSideComponent,
    CauseGroupSideBarComponent,
    CauseSideBarComponent,
    CauseGroupRowComponent,
    CausesListComponent,
  },

  mixins: [
    SortOrderMixin,
  ],

  beforeRouteEnter(to, from, next) {
    next();
    Bus.$emit('open-cause-page');
  },

  data() {
    return {
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
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchText;
    },

    totalCauses() {
      return this.data.reduce((prev, current) => (current.causes.length + prev), 0);
    },

    data() {
      if (this.searchText) {
        const searchString = this.searchText.toLowerCase();
        return this.causeGroups
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
      return this.causeGroups;
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
  },

  methods: {
    async getData() {
      const expandedIds = this.causeGroups
        .filter(item => item.isExpanded)
        .map(item => item.id);
      await this.$store.dispatch('Causes/getData');
      await this.$store.dispatch('CauseGroups/getData');
      this.causeGroups = this.$store.state.CauseGroups.data
        .map(item => ({
          ...item,
          causes: this.$store.state.Causes.data
            .filter(cause => cause.cause_group_id === item.id),
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
  },
};
</script>

<style>

</style>