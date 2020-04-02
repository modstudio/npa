<template>
  <div>
    <search-bar-component
      v-model="searchReport"
      :is-filtered="isFiltered"
      search-placeholder="Search Report"
      @resetfilter="resetFilter"
    ></search-bar-component>
     <div class="flex-table mx-4 color-neutral-800p">
      <div class="position-relative mb-2" v-for="item in reportData" :key="item.id">       
        <div class="flex-table__row w-shadow expandable flex-table__row--small"
          @click="toggleCollapse(item)"
          :aria-expanded="item.isExpanded"
          :aria-controls="`register-report-${item.id}`"
        >
          <div class="flex-table__header-item col-12 justify-content-between font-weight-regular" 
            tabindex="0" 
            :class="{'sorted-up': item.isExpanded, 'sorted-down': !item.isExpanded}"
          >
            {{item.name}}
             <i class="icon icon-triangle-down"></i>
          </div>
        </div>
        <b-collapse :id="`register-report-${item.id}`" v-model="item.isExpanded">
          <div class="flex-table__row w-shadow mt-2 ml-2" v-for="reportItem in item.data"
            :key="reportItem.id">
            <div class="flex-table__row-item col-6" tabindex="0">
              {{reportItem.name}}
            </div>
            <div class="flex-table__row-item col-6 justify-content-end" tabindex="0">
              <amount-info-component
                :amount="reportItem.amount"
                :is-colored="false"
              ></amount-info-component>
            </div>            
          </div>
        </b-collapse>
      </div>
     </div>
  </div>
</template>

<script>
import SearchBarComponent from '../common/search-bar/SearchBarComponent';

export default {
  props: {
    data: {
      type: Array,
      default: null,
    },
  },

  components: {
    SearchBarComponent,
  },

  data() {
    return {
      searchReport: null,
      expandedIdsBeforeSearching: null,
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchReport;
    },

    reportData() {
      if (this.searchReport) {
        let { data } = this;
        if (!this.expandedIdsBeforeSearching) {
          this.expandedIdsBeforeSearching = this.data
            .filter(item => item.isExpanded)
            .map(item => item.id);
        }
        this.searchReport.split(' ').forEach((searchItem) => {
          const searchString = searchItem.toLowerCase();
          data = data.map(item => ({
            ...item,
            data: item.data.filter(item => item.name.toLowerCase().indexOf(searchString) !== -1),
          }));
        });
        this.$nextTick(() => this.expandAll());
        return data;
      } else if (this.expandedIdsBeforeSearching) {
        for (let i = 0; i < this.data.length; i += 1) {
          this.data[i].isExpanded = this.expandedIdsBeforeSearching.includes(this.data[i].id);
        }
        this.expandedIdsBeforeSearching = null;
      }
      return this.data;
    },
  },

  methods: {
    toggleCollapse(item) {
      const index = _.findIndex(this.data, { id: item.id });
      if (index !== -1) {
        this.data[index].isExpanded = !item.isExpanded;
      }
    },

    resetFilter() {
      this.searchReport = '';
    },

    expandAll() {
      this.reportData.forEach((item) => {
        if (!item.isExpanded && item.data.length) {
          this.toggleCollapse(item);
        }
      });
    },
  },
};
</script>

<style scoped>
.flex-table__row {
  height: 32px;
}
</style>