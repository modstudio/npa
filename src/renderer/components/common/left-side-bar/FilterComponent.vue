<template>
  <div ref="filter" class="dropdown search-nav-block__item search-nav-block__dropdown mx-auto mb-2"
    :class="{'show-tick': isMultipleSelect}"
  >
      <button class="btn dropdown-toggle"
          type="button"
          v-b-tooltip="{trigger: $root.tooltipTrigger,
            title: (dropdownTooltip)}"
          ischecktooltip="true"
          tabindex="0"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
          :class="{'active': isMultipleSelect && isActiveFilter}">
          <span class="dropdown-icon" v-show="iconClass"
            :class="{'active': isMultipleSelect && isActiveFilter}">
              <i :class="iconClass"></i>
          </span>
          <span class="text-small">{{nameFilter}}</span>
          <template v-if="isMultipleSelect || defaultId === null || defaultId !== value">
            <span class="text-small" v-show="isActiveFilter || selectedItem">
              &nbsp;|&nbsp;
            </span>
            <span class="dropdown-multiselect text-small" v-if="isMultipleSelect"
              :class="{'active': isActiveFilter}"
              v-overflow-number-additional-items="{items: dropdownTitle}"
            ></span>
            <span class="dropdown-multiselect text-small" v-else >{{dropdownTitle}}</span>
          </template>
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" ref="filterDropdownMenu">
          <button class="dropdown-item" type="button" v-if="isMultipleSelect"
              @click.stop="setFilter(null)"
              :class="{'active': !filteredItems.length}"
              ><span>{{nameAllItem}}</span>
          </button>
          <div class="bs-searchbox" v-show="isFilterSearch">
              <input type="text" class="form-control" ref="filterSearch"
                  @keydown.stop
                  @input="search"
                  placeholder="Search">
          </div>
          <slot name="option" :data="filteredData"></slot>
          <button class="dropdown-item" type="button"
              v-for="item in filteredData" :key="item.id"
              @click.stop="setFilter(item)"
              :class="{'active': isMultipleSelect && item.checked
                || !isMultipleSelect && selectedItem && item.id === selectedItem.id}"
              >
              <span :class="`${item.icon} mr-2`" v-if="item.icon"></span>
              <span>{{ item.name }}</span>
              <span class="subtext" v-if="item.subtext">{{item.subtext}}</span>
          </button>
      </div>
  </div>
</template>

<script>
const minNumberItemsForSearch = 10;

export default {
  props: {
    isMultipleSelect: {
      type: Boolean,
      default: true,
    },
    nameAllItem: {
      type: String,
      default: 'All',
    },
    nameFilter: {
      type: String,
      default: 'Filter',
    },
    iconClass: {
      type: String,
      default: '',
    },
    source: {
      type: [String, Array],
      default: null,
    },
    sourceType: {
      type: String,
      default: 'url', // url or static
    },
    value: {
      type: [Array, Number, String],
      default: () => [],
    },
    defaultId: {
      type: Number,
      default: null,
    },
    filteredDataFunc: {
      type: Function,
      default: null,
    },
    subtextFunc: {
      type: Function,
      default: null,
    },
    searchFunc: {
      type: Function,
      default: null,
    },
    sortFunc: {
      type: Function,
      default: null,
    },
    itemIconFunc: {
      type: Function,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },

  watch: {
    value() {
      this.updateItemFilter();
    },

    source() {
      if (this.sourceType === 'static') {
        this.destroyScrollBar();
        this.$nextTick(() => this.getData());
      }
    },
  },

  computed: {
    filteredData() {
      let { data } = this;
      if (this.filteredDataFunc) {
        data = this.filteredDataFunc(data);
      }
      const searchString = this.searchText.toLowerCase();
      return _.filter(
        data,
        (item) => {
          if (this.searchFunc) {
            return this.searchFunc(item, searchString);
          }
          return item.name && item.name.toLowerCase().indexOf(searchString) !== -1;
        },
      );
    },

    isFilterSearch() {
      return this.searchText || this.filteredData.length >= minNumberItemsForSearch;
    },

    dropdownTooltip() {
      if (!this.isMultipleSelect) {
        return this.selectedItem ? this.selectedItem.name : '';
      }
      return this.filteredItems.length ? this.$root.joinNameItems(this.filteredItems)
        : this.nameAllItem;
    },

    filteredItems() {
      return _.filter(this.data, 'checked');
    },

    isActiveFilter() {
      const isActive = this.defaultId
        ? !_.isEqual([this.defaultId], this.filteredItems.map(filterItem => filterItem.id))
        : this.filteredItems.length;
      return isActive;
    },

    dropdownTitle() {
      if (this.isMultipleSelect) {
        return this.filteredItems.length ? this.filteredItems : [];
      }
      return this.selectedItem ? this.selectedItem.name : this.placeholder;
    },
  },

  data() {
    return {
      data: [],
      searchText: '',
      selectedItem: null,
    };
  },

  created() {
    this.search = this.$root.createDebounce((el) => {
      this.searchText = el.target.value;
      this.destroyScrollBar();
    });
  },

  mounted() {
    this.getData();
    // Center dropdown
    $(this.$refs.filter).on('show.bs.dropdown', function () {
      const dropdownMenu = $(this).find('.dropdown-menu');
      const parentWidth = dropdownMenu.parent().innerWidth();
      const menuWidth = dropdownMenu.innerWidth();
      let margin = (parentWidth / 2) - (menuWidth / 2);
      margin = `${margin}px`;
      dropdownMenu.css('margin-left', margin);
    });
    // prevent parent scroll it dropdown has not scroll
    $(this.$refs.filterDropdownMenu).on('mousewheel', function (e) {
      if (this.clientHeight === this.scrollHeight) {
        e.preventDefault();
      }
    });

    $(this.$refs.filter).on('show.bs.dropdown', () => {
      this.$nextTick(() => {
        this.setFocusSearchField();
      });
    });

    $(this.$refs.filter).on('hidden.bs.dropdown', () => {
      this.$nextTick(() => {
        this.destroyScrollBar();
        this.searchText = '';
        if (this.$refs.filterSearch) {
          this.$refs.filterSearch.value = '';
        }
        // Sort dropdown after hidden
        if (this.sortFunc) {
          this.data = this.sortFunc(this.data);
        }
        this.$nextTick(function () {
          this.bindScrollBars();
        });
      });
    });
  },

  updated() {
    this.$nextTick(function () {
      this.bindScrollBars();
    });
  },

  methods: {
    bindScrollBars() {
      const options = {
        axis: 'y',
        theme: 'dark',
        mouseWheel: { preventDefault: true },
        advanced: {
          updateOnImageLoad: false,
          autoScrollOnFocus: false,
        },
      };
      const { activeElement } = document;
      if (this.isBindedScrollBar(this.$refs.filterDropdownMenu)) {
        $(this.$refs.filterDropdownMenu).mCustomScrollbar('update');
      } else {
        $(this.$refs.filterDropdownMenu).mCustomScrollbar('destroy');
        $(this.$refs.filterDropdownMenu).mCustomScrollbar(options);
      }
      if (activeElement) {
        activeElement.focus({ preventScroll: true });
      }
      this.setFocusSearchField();
      return true;
    },

    isBindedScrollBar(el) {
      return el.children.length === 1 && el.firstChild.classList
        && el.firstChild.classList.contains('mCustomScrollBox');
    },

    getData() {
      if (this.source) {
        let getPromise;
        if (this.sourceType && this.sourceType === 'static') {
          getPromise = Promise.resolve(_.cloneDeep(this.source));
        } else {
          getPromise = axios.get(this.source)
            .then(response => response.data);
        }
        getPromise
          .then((data) => {
            this.data = data.map(item => ({
              ...item,
              checked: false,
              icon: (this.itemIconFunc ? this.itemIconFunc(item) : ''),
            }));
            this.updateItemFilter();
          })
          .catch(err => console.log('error loading filter data', err));
      }
    },

    setFilter(item) {
      if (this.isMultipleSelect) {
        if (item) {
          item.checked = !item.checked;
        } else {
          _.forEach(this.data, (filterItem) => {
            filterItem.checked = false;
          });
        }

        this.$emit('input', this.filteredItems.map(filterItem => filterItem.id));
      } else {
        this.selectedItem = item;
        this.$emit('input', item.id);
      }
      this.$emit('filter');
    },

    updateItemFilter() {
      _.forEach(this.data, (item) => {
        if (this.isMultipleSelect) {
          item.checked = this.value.indexOf(item.id) !== -1;
        }
        if (!item.subtext) {
          item.subtext = (this.subtextFunc ? this.subtextFunc(item) : '');
        }
      });
      if (!this.isMultipleSelect) {
        this.selectedItem = _.find(this.data, { id: this.value });
      }
    },

    setFocusSearchField() {
      if (this.$refs.filterSearch) {
        this.$refs.filterSearch.focus();
      }
    },

    destroyScrollBar() {
      this.$nextTick(() => {
        if (this.$refs.filterDropdownMenu
          && this.isBindedScrollBar(this.$refs.filterDropdownMenu)) {
          $(this.$refs.filterDropdownMenu).mCustomScrollbar('destroy');
        }
      });
    },
  },
};
</script>
