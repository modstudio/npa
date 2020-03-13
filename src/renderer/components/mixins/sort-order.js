/**
 * This provides methods for ordering draggable items
 * @mixin sort-order
 */
export default {
  /**
   * The component's data.
   */
  data() {
    return {
      sortOrderStoreName: '', // name of vuex store module of resource
    };
  },

  methods: {
    /**
     * Update sort change event
     */
    onSortChange(ev) {
      if (ev.moved) {
        const orderPromises = [];
        this.isProcessing = true;
        for (let i = Math.min(ev.moved.oldIndex, ev.moved.newIndex);
          i <= Math.max(ev.moved.oldIndex, ev.moved.newIndex); i += 1) {
          const sortOrder = i + 1;
          orderPromises.push(this.updateOrderRequest(this.data[i].id, sortOrder));
        }
        Promise.all(orderPromises)
          .then(() => {
            this.$emit('updateSortOrder');
            this.isProcessing = false;
          })
          .catch((err) => {
            console.log('error update order', err);
            this.isProcessing = false;
          });
      }
    },

    updateOrderRequest(itemId, newIndex) {
      return this.$store.dispatch(`${this.sortOrderActionName}`, {
        id: itemId,
        sortOrder: newIndex,
      });
    },
  },
};
