module.exports = {
  methods: {
    /**
     * scroll to the first error on screen
     * @param {*} el
     */
    scrollToFirstError(el = document, isCustomScrollBar = false) {
      const formEl = Array.isArray(el) ? el[0] : el;
      let errorEl = null;
      if (formEl.querySelector('.is-invalid')) {
        errorEl = formEl.querySelector('.is-invalid').parentElement;
      }
      if (errorEl && !isCustomScrollBar) {
        errorEl.scrollIntoView();
      } else if (errorEl && isCustomScrollBar) {
        $(errorEl).closest('.mCustomScrollBox').parent().mCustomScrollbar('scrollTo', errorEl);
      }
    },

    scrollUp(el = document) {
      $(el).closest('.mCustomScrollBox').parent().mCustomScrollbar('scrollTo', 'top');
    },
  },
};
