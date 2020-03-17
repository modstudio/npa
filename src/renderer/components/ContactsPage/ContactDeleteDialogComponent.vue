<template>
  <div>
    <div class="info-sidebar__body">
      <div class="info-sidebar__block-title mb-4">
        Do you really want to delete contact?
      </div>    
    </div>
    <div class="info-sidebar__footer">
      <div class="d-flex justify-content-center align-items-center">
        <button type="button" class="btn btn-block btn-secondary w-156"
          @click="$emit('close-dialog')">
            Hmm.. I will rethink this
        </button>
        <action-button
          button-name="Yes, as sure as ever"
          loading-name="Deleting"
          :form-busy="isProcessing"
          additional-class="w-156 ml-4"
          @click="deleteItem"
        ></action-button>
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
  },

  data() {
    return {
      isProcessing: false,
    };
  },

  methods: {
    async deleteItem() {
      this.isProcessing = true;
      await this.$store.dispatch('Contacts/deleteContact', this.item.id);
      this.$emit('item-deleted');
      this.isProcessing = false;
    },
  },
};
</script>

<style>

</style>