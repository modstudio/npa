module.exports = {
  methods: {
    bindScrollBarToEl(el, opt = null) {
      let options = {
        axis: 'y',
        theme: 'dark',
        mouseWheel: { preventDefault: true },
        advanced: {
          updateOnImageLoad: false,
          autoScrollOnFocus: false,
        },
      };
      if (opt) {
        options = _.merge(options, opt);
      }
      if (this.isBindedScrollBar(el)) {
        $(el).mCustomScrollbar('update');
      } else {
        $(el).mCustomScrollbar('destroy');
        $(el).mCustomScrollbar(options);
      }
      return true;
    },

    unbindScrollBarFromEl(el) {
      if (el) {
        $(el).mCustomScrollbar('destroy');
      }
    },

    isBindedScrollBar(el) {
      return el.children.length === 1 && el.firstChild.classList.contains('mCustomScrollBox');
    },

    /**
         * Bind Scrollbar to selectpicker
         */
    $_bindScrollBarToSelectpicker(dropdownEl) {
      if (dropdownEl) {
        this.bindScrollBarToEl(dropdownEl);
      }
    },

    /**
         * Unbind Scrollbar from selectpicker
         */
    $_unbindScrollBarFromSelectpicker(dropdownEl) {
      this.unbindScrollBarFromEl(dropdownEl);
    },
  },
};
