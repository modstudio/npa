<template>
  <div>
    <pikadon-left-side-component
      v-model="searchText"
    ></pikadon-left-side-component>
    <div class="d-flex">
      <div class="flex-grow-1">
        {{data.length}} total
      </div>
      <button type="button" class="btn btn-secondary" @click="addItem">
        Add Pikadon
      </button>
    </div>
    <div class="flex-table">
      <div class="flex-table__header">
        <div class="flex-table__header-item col-4">
          Contact
        </div>
        <div class="flex-table__header-item col-4">
          Metrics
        </div>
        <div class="flex-table__header-item col-4">
          Balance
        </div>                     
      </div>
      <div is="draggable" v-model="data" tag="div"
        handle=".list-components__item-move"
        @change="onSortChange">
        <div class="position-relative" v-for="item in data"
          :key="item.id">
          <span class="list-components__item-move">
            <i class="icon icon-drag"></i>
          </span>
          <div class="flex-table__row w-shadow"
            @click="viewItem(item)"
            :class="{'active': currentItem && currentItem.id === item.id}">
            <div class="flex-table__row-item col-4 font-weight-bold"
                tabindex="0">
                <contact-name-field-component
                  :company-name="item.contact_company_name"
                  :first-name="item.contact_first_name"
                  :last-name="item.contact_last_name"
                ></contact-name-field-component>
            </div>
            <div class="flex-table__row-item col-4"
                tabindex="0">
            </div>
            <div class="flex-table__row-item col-4"
                tabindex="0">
            </div>                        
          </div>
        </div>
      </div>
    </div>      
    <pikadon-side-bar-component
      :current-item="currentItem"
      :is-shown="isViewPanel"
      :mode="viewPanelMode"
      @hidepanel="hidePanel"
      @update="getData"
      @add-new="addItem"
    ></pikadon-side-bar-component>         
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import SortOrderMixin from '../mixins/sort-order';
import PikadonLeftSideComponent from './PikadonPage/PikadonLeftSideComponent';
import PikadonSideBarComponent from './PikadonPage/PikadonSideBarComponent';
import ContactNameFieldComponent from '../common/ContactNameFieldComponent';
import Bus from '../../shared/EventBus';

export default {
  components: {
    draggable,
    PikadonLeftSideComponent,
    PikadonSideBarComponent,
    ContactNameFieldComponent,
  },

  mixins: [SortOrderMixin],

  beforeRouteEnter(to, from, next) {
    next();
    Bus.$emit('open-pikadon-page');
  },

  data() {
    return {
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      sortOrderActionName: 'Pikadons/setSortOrder',
    };
  },

  computed: {
    data: {
      get() {
        let { data } = this.$store.state.Pikadons;
        if (this.searchText) {
          const searchString = this.searchText.toLowerCase();
          data = data
            .filter(item => item.contact_company_name.toLowerCase().indexOf(searchString) !== -1
              || item.contact_first_name.toLowerCase().indexOf(searchString) !== -1
              || item.contact_last_name.toLowerCase().indexOf(searchString) !== -1
              || (item.note && item.note.toLowerCase().indexOf(searchString) !== -1));
        }
        return data;
      },
      async set(data) {
        await this.$store.commit('Pikadons/setData', data);
      },
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('Pikadons/getData');
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