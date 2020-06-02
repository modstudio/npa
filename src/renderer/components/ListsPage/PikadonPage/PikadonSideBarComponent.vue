<template>
  <div v-show="isShown">
    <right-side-bar-component
      header-image-url="./static/images/register.svg"
      header-image-style="background-size: auto;"
      init-event-name="open-pikadon-page"
      @hidepanel="$emit('hidepanel')"
    >
      <template slot="header">{{ headerName }}</template>
      <template slot="headerBadge">{{ currentItem ? currentItem.id : '' }}</template>
      <div>
        <div class="info-sidebar__body" ref="form" v-show="!isDeleteMode">
          <div class="info-sidebar__block-header">
              <h4>Pikadon</h4>
          </div>
            <ValidationObserver ref="observer">
              <!-- Contact -->
              <contact-select-component
                v-model="form.contact_id"
                label="Contact"
                rules="required"
                @add-new="onAddNewContact"
              ></contact-select-component>         
              <!-- Note -->
              <textarea-component
                v-model="form.note"
                label="Note"
              ></textarea-component>            
            </ValidationObserver>
        </div>

        <item-delete-dialog-component v-if="isDeleteMode"
          :item="currentItem"
          item-name="Pikadon"
          store-action-name="Categories/deleteItem"
          archive-action-name="Categories/archiveItem"
          make-active-action-name="Categories/activateItem"
          :has-association="hasAssociation"
          @close-dialog="isDeleteMode = false"
          @item-deleted="onDeleteItem"
        ></item-delete-dialog-component>
      </div>
      <div class="info-sidebar__footer" v-show="!isDeleteMode">
        <footer-buttons-component
          v-if="!isDeleteMode && !isAddNewDialog"
          :is-new-mode="isNewMode"
          :is-saving-and-new-process="isSavingAndNewProcess"
          :is-saving-and-close-process="isSavingAndCloseProcess"
          :has-association="hasAssociation"
          :isInactive="isInactive"
          @save-and-new="saveAndNew"
          @save-and-close="saveAndClose"
          @delete="deleteAction"
          @cancel="$emit('hidepanel')"
        ></footer-buttons-component>
        <!-- Add new item mode -->
        <div class="d-flex justify-content-end align-items-center" v-if="isAddNewDialog">
            <action-button
              button-name="Cancel"
              additional-class="btn-secondary w-156"
              @click="$emit('hidepanel')"
            ></action-button>
            <action-button
              button-name="Save and Resume"
              loading-name="Saving"
              additional-class="w-156 ml-4"
              @click="saveAndClose"
              :form-busy="isSavingAndCloseProcess"
            ></action-button>
        </div>        
      </div>
    </right-side-bar-component>
  </div>  
</template>

<script>
import ItemDeleteDialogComponent from '../../common/right-side-bar/ItemDeleteDialogComponent';
import ContactSelectComponent from '../../common/form-select-components/ContactSelectComponent';
import sideBarPanelMixin from '../../mixins/side-bar-panel';

export default {
  components: {
    ItemDeleteDialogComponent,
    ContactSelectComponent,
  },

  mixins: [sideBarPanelMixin],

  computed: {
    headerName() {
      if (this.isAddNewDialog) {
        return 'Add new pikadon';
      }
      return this.isNewMode ? 'New Pikadon' : `${this.name}`;
    },

    name() {
      if (!this.currentItem) {
        return '';
      }
      if (this.currentItem.contact_company_name) {
        return this.currentItem.contact_company_name;
      }
      return `${this.currentItem.contact_first_name} ${this.currentItem.contact_last_name}`;
    },
  },

  data() {
    return {
      checkAssociationActionName: 'Categories/checkAssociation',
    };
  },

  methods: {
    newForm() {
      return {
        id: null,
        category_type_id: 4,
        contact_id: null,
        note: '',
      };
    },

    async saveItem() {
      const result = await this.$store.dispatch('Categories/addData', this.form);
      return result;
    },

    async updateItem() {
      const result = await this.$store.dispatch('Categories/updateData', this.form);
      return result;
    },

    onAddNewContact() {
      this.$emit('add-new-contact', (id) => {
        this.form.contact_id = id;
      });
    },
  },
};
</script>

<style>

</style>