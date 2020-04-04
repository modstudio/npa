<template>
  <div v-show="isShown">
    <right-side-bar-component
      header-image-url="./static/images/register.svg"
      header-image-style="background-size: auto;"
      init-event-name="open-trx-method-page"
      @hidepanel="$emit('hidepanel')"
    >
      <template slot="header">{{ headerName }}</template>
      <template slot="headerBadge">{{ currentItem ? currentItem.id : '' }}</template>
      <div>
        <div class="info-sidebar__body" ref="form" v-show="!isDeleteMode">
          <div class="info-sidebar__block-header">
              <h4>Transaction method</h4>
          </div>
            <ValidationObserver ref="observer">
              <!-- Name -->
              <text-input-component
                v-model="form.name"
                :rules="{required: true, uniqueTrxMethod: form.id}"
                label="Name"
              ></text-input-component>
              <!-- Note -->
              <textarea-component
                v-model="form.note"
                label="Note"
              ></textarea-component>            
            </ValidationObserver>
        </div>

        <item-delete-dialog-component v-if="isDeleteMode"
          :item="currentItem"
          item-name="Transaction method"
          store-action-name="TrxMethods/deleteItem"
          archive-action-name="TrxMethods/archiveItem"
          :has-association="hasAssociation"
          @close-dialog="isDeleteMode = false"
          @item-deleted="onDeleteItem"
        ></item-delete-dialog-component>
      </div>
      <div class="info-sidebar__footer" v-show="!isDeleteMode">
        <footer-buttons-component
          v-if="!isDeleteMode"
          :is-new-mode="isNewMode"
          :is-saving-and-new-process="isSavingAndNewProcess"
          :is-saving-and-close-process="isSavingAndCloseProcess"
          :has-association="hasAssociation"
          @save-and-new="saveAndNew"
          @save-and-close="saveAndClose"
          @delete="deleteAction"
          @cancel="$emit('hidepanel')"
        ></footer-buttons-component>
      </div>
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
      return this.isNewMode ? 'New Trx. Method' : `${this.name}`;
    },

    name() {
      return this.currentItem ? this.currentItem.name : '';
    },
  },

  data() {
    return {
      checkAssociationActionName: 'TrxMethods/checkAssociation',
    };
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
      const result = await this.$store.dispatch('TrxMethods/addData', this.form);
      return result;
    },

    async updateItem() {
      const result = await this.$store.dispatch('TrxMethods/updateData', this.form);
      return result;
    },
  },
};
</script>

<style>

</style>