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
              <!-- Name -->
              <text-input-component
                v-model="form.name"
                :rules="{required: true, uniqueCause: form.id}"
                label="Name"
              ></text-input-component>
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
              ></contact-select-component>
              <!-- Distribution Class -->
              <dist-class-select-component
                v-model="form.distribution_class_id"
                rules="required"
              ></dist-class-select-component>                    
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
          :has-association="hasAssociation"
          @close-dialog="isDeleteMode = false"
          @item-deleted="onDeleteItem"
        ></item-delete-dialog-component>

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
  components: {
    ItemDeleteDialogComponent,
    CauseGroupSelectComponent,
    ContactSelectComponent,
    DistClassSelectComponent,
  },

  mixins: [sideBarPanelMixin],

  computed: {
    headerName() {
      return this.isNewMode ? 'New Cause' : `${this.name}`;
    },

    name() {
      return this.currentItem ? this.currentItem.name : '';
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
        name: '',
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
  },
};
</script>

<style>

</style>