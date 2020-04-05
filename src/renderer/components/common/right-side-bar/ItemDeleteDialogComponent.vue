<template>
  <div>
    <template v-if="isInactive">
      <div class="info-sidebar__body">
        <div class="info-sidebar__block-title mb-4">
          Do you really want to activate {{ itemName }}?
        </div>
      </div>
    </template>    
    <template v-else-if="hasAssociation">
      <div class="info-sidebar__body">
        <div class="info-sidebar__block-title mb-4">
          Do you really want to archive {{itemName}}?
        </div>
        <div class="text-center"><span class="subtext">{{subtext}}</span></div>
      </div>
    </template>
    <template v-else-if="hasAssociation !== null">
      <div class="info-sidebar__body">
        <div class="info-sidebar__block-title mb-4">
          Do you really want to delete {{ itemName }}?
        </div>
      </div>
    </template>
    <div class="info-sidebar__footer">
      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-block btn-secondary w-156"
          @click="$emit('close-dialog')">
            Hmm.. I will rethink this
        </button>

        <action-button
          button-name="Yes, as sure as ever"
          :loading-name="loadingName"
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
    itemName: {
      type: String,
      default: '',
    },
    storeActionName: {
      type: String,
      default: null,
    },
    archiveActionName: {
      type: String,
      default: null,
    },
    makeActiveActionName: {
      type: String,
      default: null,
    },
    hasAssociation: {
      type: Boolean,
      default: null,
    },
    subtext: {
      type: String,
      default: null,
    },
  },

  computed: {
    loadingName() {
      return this.hasAssociation ? 'Archiving' : 'Deleting';
    },

    isInactive() {
      return this.item && this.item.is_inactive === 1;
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
      if (this.isInactive) {
        await this.$store.dispatch(this.makeActiveActionName, this.item.id);
      } else if (this.hasAssociation) {
        await this.$store.dispatch(this.archiveActionName, this.item.id);
      } else {
        await this.$store.dispatch(this.storeActionName, this.item.id);
      }
      this.$emit('item-deleted');
      this.isProcessing = false;
    },
  },
};
</script>

<style>

</style>