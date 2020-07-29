module.exports = {

  /**
     * The component's data.
     */
  data() {
    return {
      tooltipTrigger: 'click blur hover',
    };
  },

  mounted() {
    /**
         * Disable tooltip if text not overflow the field
         */
    this.$root.$on('bv::tooltip::show', (bvEvent) => {
      if (!this.hasAdditionalContent(bvEvent.target)
                    && bvEvent.target.getAttribute('ischecktooltip')) {
        this.checkAppearingTooltip(bvEvent);
      }
    });

    if (this.isTouchDevice()) {
      this.tooltipTrigger = 'click blur';
    } else {
      this.tooltipTrigger = 'hover';
    }
  },

  methods: {
    /**
         * Disable appearing tooltip if text not overflow the field
         * @param {*} bvEvent
         */
    checkAppearingTooltip(bvEvent) {
      if (!this.isEllipsis(bvEvent.target)) {
        bvEvent.preventDefault();
      }
    },

    /**
         * Element ellipsis detection
         * @param {*} el
         */
    isEllipsis(el) {
      let isEclipsis = false;
      if (el.children.length) {
        for (let i = 0, { length } = el.children; i < length; i += 1) {
          if ((el.children[i].clientWidth < el.children[i].scrollWidth)
            || (el.children[i].offsetHeight < el.children[i].scrollHeight)
          ) {
            isEclipsis = true;
            break;
          }
        }
      }
      if ((el.clientWidth < el.scrollWidth) || (el.offsetHeight < el.scrollHeight)) {
        isEclipsis = true;
      }

      return isEclipsis;
    },

    /**
         * Join array items to string for tooltip
         * @param {*} items
         */
    joinNameItems(items) {
      return _.join(_.map(items, 'name'), ', ');
    },

    /**
         * Display array items in additional format
         * @param {*} items
         */
    joinNameItemsAdditionalFormat(items) {
      return `${items[0].name}${items.length > 1 ? `, +${items.length - 1}` : ''}`;
    },

    hasAdditionalContent(target) {
      let result = false;
      if (target.getAttribute('has-additional-content')) {
        result = true;
      } else if (target.children.length) {
        for (let i = 0, { length } = target.children; i < length; i += 1) {
          result = this.hasAdditionalContent(target.children[i]);
          if (result) {
            break;
          }
        }
      }
      return result;
    },

    isTouchDevice() {
      return (('ontouchstart' in window)
                    || (navigator.MaxTouchPoints > 0)
                    || (navigator.msMaxTouchPoints > 0));
    },
  },
};
