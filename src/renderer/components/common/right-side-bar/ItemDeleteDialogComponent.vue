<template>
  <div class="info-sidebar__body">
    <template v-if="hasAssociation">
      <div class="info-sidebar__block-title mb-4">
        This {{itemName}} can’t be deleted because it is associated with other records.
      </div>
      <div class="info-sidebar__block-buttons m-b-210">
        <div class="row gutter-16">
          <div class="col-6 offset-3">
            <action-button
              button-name="Ok"
              @click="$emit('close-dialog')"
            ></action-button>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="hasAssociation !== null">
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
    </template> 
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
    checkActionName: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      hasAssociation: null,
      isProcessing: false,
    };
  },

  created() {
    this.checkAssociation();
  },

  methods: {
    async checkAssociation() {
      if (this.checkActionName) {
        this.hasAssociation = await this.$store.dispatch(this.checkActionName, this.item.id);
      } else {
        this.hasAssociation = false;
      }
    },

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