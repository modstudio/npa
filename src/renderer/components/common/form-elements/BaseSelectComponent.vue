<template>
  <div class="form-group form-group--enter" :class="formGroupClass">
      <select class="form-control form-control--enter"
          :multiple="isMultiple"
          ref="select"
          :name="name"
          :data-size="$root.config.selectSize"
          :data-none-selected-text="data.length ? 'Nothing selected' : 'No options available'"
          :data-show-subtext="showSubtext"
          :class="{'is-invalid': error, ...additionalClass}"
          :data-show-icon="showIcon"
          :title="placeholder"
          :disabled="disabled"
          :data-live-search="true"
          data-live-search-placeholder="Search"
          :data-selected-text-format="dataSelectedTextFormat"
          v-model="selected"
          >
          <slot name="option" :data="data" :is-mounted="isMounted">
            <option class="color-neutral-600" disabled v-if="data && !data.length && isMounted">
              No options available
            </option>
          </slot>
          <template v-if="isDataGroup">
            <optgroup v-for="(group, index) in data" :key="index"
              :label="group.label"
            >
              <option-item-component
                v-for="item in group.data" :key="item.id"
                :item="item"
                :search-text="searchText"
                :selected-value="selected"
                :class="{'d-flex': item.icon}">
              </option-item-component>     
            </optgroup>
          </template>
          <option-item-component v-else
            v-for="item in data" :key="item.id"
            :item="item"
            :search-text="searchText"
            :selected-value="selected"
            :class="{'d-flex': item.icon}">
          </option-item-component>
      </select>
      <label v-if="label">
          {{ label }}
      </label>

      <span class="state state--error" v-show="error">
          {{ error }}
      </span>
  </div>
</template>

<script>
/**
 * Select Component
 */
import OptionItemComponent from './OptionItemComponent';

const minNumberItemsForSearch = 10;

export default {
  props: {
    value: {
      type: [Number, String, Array],
      default: null,
    },
    name: {
      type: String,
      default: 'name',
    },
    label: {
      type: String,
      default: '',
    },
    subtextFunc: {
      type: Function,
      default: null,
    },
    showSubtext: {
      type: Boolean,
      default: false,
    },
    optionIconFunc: {
      type: Function,
      default: null,
    },
    showIcon: {
      type: String,
      default: 'true',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    sourceData: {
      type: Array,
      default: null,
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    updateEvent: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selectedIfOne: {
      type: Boolean,
      default: false,
    },
    additionalClass: {
      type: Object,
      default: null,
    },
    formGroupClass: {
      type: [Object, String],
      default: null,
    },
    disabledItemFunc: {
      type: Function,
      default: null,
    },
    liveSearchFunc: {
      type: Function,
      default: null,
    },
    floatOnTop: {
      type: Boolean,
      default: false,
    },
    sortFunc: {
      type: Function,
      default: null,
    },
    dataSelectedTextFormat: {
      type: String,
      default: 'values',
    },
    isDataGroup: {
      type: Boolean,
      default: false,
    },
  },

  mixins: [
    require('../../mixins/selectpicker'),
    require('../../mixins/scroll-bar'),
  ],

  components: {
    OptionItemComponent,
  },

  /**
   * The component's data.
   */
  data() {
    return {
      data: [],
      isMounted: false,
      selected: this.value,
      searchText: '',
    };
  },

  watch: {
    // Refresh selectpicker after changing the disabled prop
    disabled(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          if (this.$refs.select.parentNode.classList.contains('show')) {
            $(this.$refs.select).selectpicker('toggle');
            $(this.$refs.select).selectpicker('refresh');
          } else {
            $(this.$refs.select).selectpicker('refresh');
          }
        });
      }
      if (!newValue) {
        this.$nextTick(() => {
          $(this.$refs.select).selectpicker('refresh');
        });
      }
    },

    error(errorsNew) {
      if (errorsNew && !$(this.$refs.select).parent().hasClass('is-invalid')) {
        $(this.$refs.select).parent().addClass('is-invalid');
      }
    },

    sourceData(newData, oldData) {
      if (!_.isEqual(newData, oldData)) {
        if (newData) {
          this.data = newData;
        } else if (this.data.length) {
          this.data = [];
        }
        if (this.isMounted && !_.isEqual(newData, oldData)) {
          this.$nextTick(() => this.setValueSelectpicker());
        }
      }
    },

    value(newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        this.selected = newValue;
      }
    },
  },

  computed: {
    isLiveSearch() {
      if (this.isDataGroup) {
        return this.data
          && this.data.reduce((prev, curr) => prev + curr.data.length, 0)
            >= minNumberItemsForSearch;
      }
      return this.data && this.data.length >= minNumberItemsForSearch;
    },
  },

  /**
     * The component has been created by Vue.
     */
  created() {
    if (this.updateEvent) {
      Bus.$on(this.updateEvent, this.$_updateData);
    }
    this.$_search = this.$root.createDebounce((el) => {
      if (this.liveSearchFunc) {
        this.liveSearchFunc(el.target.value);
      } else {
        this.searchText = el.target.value;
      }
      if (this.isMounted) {
        this.$nextTick(() => {
          const dropdownEl = this.$_getDropdownEl();
          this.$_unbindScrollBarFromSelectpicker(dropdownEl);
          $(this.$refs.select).selectpicker('refresh');
        });
      }
    });
  },

  destroyed() {
    if (this.updateEvent) {
      Bus.$off(this.updateEvent, this.$_updateData);
    }
  },

  mounted() {
    this.getData()
      .then(() => {
        this.$nextTick(() => {
          this.bindSelectpicker();
          $(this.$refs.select)
            .on('hide.bs.select', () => {
              const dropdownEl = this.$_getDropdownEl();
              this.$_unbindScrollBarFromSelectpicker(dropdownEl);
              if (this.liveSearchFunc) {
                this.liveSearchFunc('');
              } else {
                this.searchText = '';
              }
            })
            .on('refreshed.bs.select', () => {
              const dropdownEl = this.$_getDropdownEl();
              this.$_bindScrollBarToSelectpicker(dropdownEl);
              // display or hide search box on refresh
              const searchboxEl = this.$_getSearchboxEl();
              if (searchboxEl) {
                searchboxEl.parentElement.style.display = this.isLiveSearch
                  ? 'block' : 'none';
              }
            });
          this.setValueSelectpicker();
          this.isMounted = true;
        });
      });
  },

  updated() {
    if (this.isMounted) {
      $(this.$refs.select).selectpicker('render');
      if (!$(this.$refs.select).hasClass('is-invalid')
        && $(this.$refs.select).parent().hasClass('is-invalid')) {
        $(this.$refs.select).parent().removeClass('is-invalid');
      }
    }
  },

  methods: {
    /**
     * Get Data
     */
    getData() {
      if (this.sourceData) {
        this.data = this.sourceData;
        return Promise.resolve();
      }
      if (!this.sourceUrl) {
        return Promise.resolve();
      }
      return axios.get(this.sourceUrl)
        .then((response) => {
          this.data = response.data.map(item => ({
            ...item,
            label: item.name,
            value: item.id,
            subtext: (this.subtextFunc ? this.subtextFunc(item) : ''),
            icon: (this.optionIconFunc ? this.optionIconFunc(item) : ''),
            disabled: (this.disabledItemFunc ? this.disabledItemFunc(item) : false),
          }));
          if (this.data.length === 1 && this.selectedIfOne) {
            let { value } = this.data[0];
            if (Array.isArray(this.selected)) {
              value = [this.data[0].value];
            }
            this.$emit('input', value);
          }
          if (this.floatOnTop) {
            this.$_sortItems();
          }
        });
    },

    /**
     * on change event
     *
     */
    onChange(e, clickedIndex) {
      const previousValue = this.value;
      const selectedData = _.filter(
        this.data,
        item => (Array.isArray(this.selected)
          ? this.selected.includes(item.id)
          : this.selected === item.id),
      );
      this.$emit('input', this.selected);
      this.$emit('change', this.selected, selectedData, previousValue, clickedIndex);
    },

    $_updateData() {
      this.getData().catch(err => console.log(err));
    },

    toggleSelectpicker() {
      $(this.$refs.select).selectpicker('toggle');
    },

    $_sortItems() {
      if (this.sortFunc) {
        this.data = this.sortFunc(this.data);
        return true;
      }
      this.data = _.orderBy(this.data, [item => (Array.isArray(this.selected)
        ? this.selected.includes(item.id)
        : this.selected === item.id),
      'name'], ['desc', 'asc']);
      return true;
    },

    setValueSelectpicker() {
      if (this.value !== null && (!Array.isArray(this.value) || this.value.length)) {
        $(this.$refs.select).selectpicker('val', this.value);
      }
    },
  },
};
</script>
