/**
 * Mixin for bootstrap-selectpicker
 */
module.exports = {
  props: {
    floatOnTop: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    bindSelectpicker() {
      const selectEl = Array.isArray(this.$refs.select) ? this.$refs.select[0] : this.$refs.select;
      $(selectEl).selectpicker()
        .on('changed.bs.select', this.onChange)
        // .on('loaded.bs.select', this.formatSelectpicker)
        // .on('refreshed.bs.select', this.formatSelectpicker)
        .on('hidden.bs.select', this.$_floatOnTopItems)
        .on('shown.bs.select', () => {
          // disable selectpicer search method
          const searchboxEl = this.$_getSearchboxEl();
          if (searchboxEl) {
            $(searchboxEl)
              .off('input')
              .on('input', this.$_search);
          }
          this.formatOptionsSelectpicker();
        });
    },

    formatSelectpicker() {
      const selectEl = Array.isArray(this.$refs.select) ? this.$refs.select[0] : this.$refs.select;
      if (selectEl) {
        // const button = selectEl.nextSibling;
        // const inner = button.querySelector('.filter-option-inner-inner');
        // Vue.formatElHebrewStyle(inner);
      }
    },

    formatOptionsSelectpicker() {
      this.$nextTick(() => {
        const selectEl = Array.isArray(this.$refs.select)
          ? this.$refs.select[0] : this.$refs.select;
        // const dropdown = selectEl.nextSibling.nextSibling;
        // const options = dropdown.querySelectorAll('.inner ul li span.text');
        // for (let i = 0, { length } = options; i < length; i += 1) {
        //   Vue.formatElHebrewStyle(options[i]);
        // }
        $(selectEl).selectpicker('refresh');
      });
    },

    /**
         * Move selected items on top
         */
    $_floatOnTopItems() {
      if (this.isMounted && this.floatOnTop) {
        this.$_sortItems();
        this.$nextTick(() => {
          const selectEl = Array.isArray(this.$refs.select)
            ? this.$refs.select[0] : this.$refs.select;
          $(selectEl).selectpicker('refresh');
        });
      }
    },

    $_sortItems() {},

    /**
         * get HTML Element of dropdown part for selectpicker element
         */
    $_getDropdownEl() {
      const selectEl = Array.isArray(this.$refs.select) ? this.$refs.select[0] : this.$refs.select;
      if (selectEl) {
        return selectEl.parentElement.querySelector('.dropdown-menu.show > .inner.show');
      }
      return null;
    },

    $_getSearchboxEl() {
      const selectEl = Array.isArray(this.$refs.select) ? this.$refs.select[0] : this.$refs.select;
      if (selectEl) {
        return selectEl.parentElement.querySelector('.dropdown-menu.show .bs-searchbox input');
      }
      return null;
    },

    $_search() {},
  },
};
