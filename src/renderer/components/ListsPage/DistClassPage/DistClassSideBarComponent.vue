<template>
  <div v-show="isShown">
    <right-side-bar-component
      header-image-url="./static/images/contacts.svg"
      header-image-style="background-size: auto;"
      init-event-name="open-dist-class-page"
      @hidepanel="$emit('hidepanel')"
    >
      <template slot="header">{{ headerName }}</template>
      <template slot="headerBadge">{{ currentItem ? currentItem.id : '' }}</template>

      <div class="info-sidebar__body" ref="form" v-show="!isDeleteMode">
        <div class="info-sidebar__block-header">
            <h4>Distribution Class</h4>
        </div>
          <ValidationObserver ref="observer">
            <!-- Name -->
            <text-input-component
              v-model="form.name"
              rules="required"
              label="Name"
            ></text-input-component>
            <!-- Note -->
            <textarea-component
              v-model="form.note"
              label="Note"
            ></textarea-component>            
          </ValidationObserver>
      </div>

      <item-delete-dialog-component v-show="isDeleteMode"
        :item="currentItem"
        item-name="Distribution Class"
        store-action-name="DistClasses/deleteItem"
        @close-dialog="isDeleteMode = false"
        @item-deleted="onDeleteContact"
      ></item-delete-dialog-component>

      <template slot="footer">
        <footer-buttons-component
          v-if="!isDeleteMode"
          :is-new-mode="isNewMode"
          :is-saving-and-new-process="isSavingAndNewProcess"
          :is-saving-and-close-process="isSavingAndCloseProcess"
          @save-and-new="saveAndNew"
          @save-and-close="saveAndClose"
          @delete="deleteAction"
          @cancel="$emit('hidepanel')"
        ></footer-buttons-component>
      </template>
    </right-side-bar-component>
  </div>  
</template>

<script>
import ItemDeleteDialogComponent from '../../common/right-side-bar/ItemDeleteDialogComponent';
import sideBarPanelMixin from '../../mixins/side-bar-panel';

export default {
  components: { ItemDeleteDialogComponent },

  mixins: [sideBarPanelMixin],

  computed: {
    headerName() {
      return this.isNewMode ? 'New Dist. Class' : `${this.name}`;
    },

    name() {
      return this.currentItem ? this.currentItem.name : '';
    },
  },

  methods: {
    newForm() {
      return {
        id: null,
        name: '',
        note: '',
      };
    },

    async saveItem() {
      const result = await this.$store.dispatch('DistClasses/addData', this.form);
      return result;
    },

    async updateItem() {
      const result = await this.$store.dispatch('DistClasses/updateData', this.form);
      return result;
    },
  },
};
</script>

<style>

</style>