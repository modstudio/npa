<template>
  <div v-show="isShown">
    <right-side-bar-component
      header-image-url="./static/images/register.svg"
      header-image-style="background-size: auto;"
      init-event-name="open-cause-page"
      @hidepanel="$emit('hidepanel')"
    >
      <template slot="header">{{ headerName }}</template>
      <template slot="headerBadge">{{ currentItem ? currentItem.id : '' }}</template>

      <div>
        <div class="info-sidebar__body" ref="form" v-show="!isDeleteMode">
          <div class="info-sidebar__block-header">
              <h4>Cause</h4>
          </div>
            <ValidationObserver ref="observer">
              <!-- Group -->
              <cause-group-select-component
                v-model="form.category_group_id"
                rules="required"
              ></cause-group-select-component>
              <!-- Recipient -->
              <contact-select-component
                v-model="form.contact_id"
                label="Recipient"
                placeholder="Choose recipient"
                rules="required"
                @add-new="onAddNewContact"
              ></contact-select-component>
              <!-- Description -->
              <text-input-component
                v-model="form.description"
                label="Description"
              ></text-input-component>              
              <!-- Distribution Class -->
              <dist-class-select-component
                v-model="form.distribution_class_id"
                rules="required"
              ></dist-class-select-component>
              <!-- Exclude from full export -->
              <checkbox-component
                v-model="form.is_excluded_from_full_export"
                label="Exclude from full export"
              ></checkbox-component>                
              <!-- Note -->
              <textarea-component
                v-model="form.note"
                label="Note"
              ></textarea-component>            
            </ValidationObserver>
        </div>

        <item-delete-dialog-component v-if="isDeleteMode"
          :item="currentItem"
          item-name="Cause"
          store-action-name="Categories/deleteItem"
          archive-action-name="Categories/archiveItem"
          make-active-action-name="Categories/activateItem"
          :has-association="hasAssociation"
          @close-dialog="isDeleteMode = false"
          @item-deleted="onDeleteItem"
        ></item-delete-dialog-component>

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
      </div>
    </right-side-bar-component>
  </div>  
</template>

<script>
import ItemDeleteDialogComponent from '../../common/right-side-bar/ItemDeleteDialogComponent';
import sideBarPanelMixin from '../../mixins/side-bar-panel';
import CauseGroupSelectComponent from '../../common/form-select-components/CauseGroupSelectComponent';
import ContactSelectComponent from '../../common/form-select-components/ContactSelectComponent';
import DistClassSelectComponent from '../../common/form-select-components/DistClassSelectComponent';

export default {
  props: {
    // Property is true if we use contact sidebar separately for adding a new contact
    isAddNew: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ItemDeleteDialogComponent,
    CauseGroupSelectComponent,
    ContactSelectComponent,
    DistClassSelectComponent,
  },

  mixins: [sideBarPanelMixin],

  computed: {
    headerName() {
      if (this.isAddNewDialog) {
        return 'Add new cause';
      }
      return this.isNewMode ? 'New Cause' : `${this.name}`;
    },

    name() {
      return this.currentItem ? this.currentItem.category_name : '';
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
        category_type_id: 1,
        category_group_id: null,
        contact_id: null,
        distribution_class_id: null,
        description: '',
        is_excluded_from_full_export: 0,
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