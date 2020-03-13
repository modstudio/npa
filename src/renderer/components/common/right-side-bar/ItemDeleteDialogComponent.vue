<template>
  <div class="info-sidebar__body">
    <div class="info-sidebar__block-title mb-4">
        Do you really want to delete {{ itemName }}?
      </div>
      <div class="info-sidebar__block-buttons m-b-210">
        <div class="row gutter-16">
            <div class="col-6">
              <button type="button" class="btn btn-block btn-secondary"
                @click="$emit('close-dialog')">
                  Hmm.. I will rethink this
              </button>
            </div>
            <div class="col-6">
              <action-button
                button-name="Yes, as sure as ever"
                loading-name="Deleting"
                :form-busy="isProcessing"
                @click="deleteItem"
              ></action-button>
            </div>
        </div>
      </div>    
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
    itemName: {
      type: String,
      default: '',
    },
    storeActionName: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      isProcessing: false,
    };
  },

  methods: {
    async deleteItem() {
      this.isProcessing = true;
      await this.$store.dispatch(this.storeActionName, this.item.id);
      this.$emit('item-deleted');
      this.isProcessing = false;
    },
  },
};
</script>

<style>

</style>