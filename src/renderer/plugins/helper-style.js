/* global _ */
const HelperStyle = {
  install(Vue) {
    Vue.joinItemsByName = function (items) {
      return _.join(_.map(items, 'name'), ', ');
    };

    /**
         * Using in directive overflow-number-additional-items
         */
    Vue._formatElAdditional = function (el, bind) {
      const items = bind.value && bind.value.items ? bind.value.items : [];

      el.innerHTML = Vue.joinItemsByName(items);

      el.removeAttribute('has-additional-content');
      el.style.overflow = ''; // reset overflow
      if (el.offsetWidth < el.scrollWidth) {
        let countAdditional = 0;
        for (let i = items.length - 1; i > 0; i -= 1) {
          if (el.offsetWidth < el.scrollWidth) {
            countAdditional += 1;
            el.innerHTML = `${Vue.joinItemsByName(items.slice(0, i))}, +${countAdditional}`;
          } else {
            break;
          }
        }

        if (countAdditional) {
          el.setAttribute('has-additional-content', true);
        }
      } else {
        // set overflow to visible in order to issue
        // when offsetWidth with hidden and visible overflow is the same
        el.style.overflow = 'visible';
      }
    };

    /**
     * Fill and Format of element content using the array.
     * Elements of the array are concatenated by field "name".
     * If the element is overflowed it will be formatted via 'name, + add'.
     */
    Vue.directive('overflow-number-additional-items', {
      inserted: Vue._formatElAdditional,
      update: Vue._formatElAdditional,
    });
  },
};

export default HelperStyle;
