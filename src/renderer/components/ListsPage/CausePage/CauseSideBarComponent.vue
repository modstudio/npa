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

      <div class="info-sidebar__body" ref="form" v-show="!isDeleteMode">
        <div class="info-sidebar__block-header">
            <h4>Cause</h4>
        </div>
          <ValidationObserver ref="observer">
            <!-- Name -->
            <text-input-component
              v-model="form.name"
              rules="required"
              label="Name"
            ></text-input-component>
            <!-- Group -->
            <select-component
              v-model="form.cause_group_id"
              label="Group"
              rules="required"
              placeholder="Choose Group"
              :source-data="$store.state.CauseGroups.data.map(
                item => ({
                  value: item.id,
                  label: item.name,
                  ...item })
              )"
            ></select-component>
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

      <item-delete-dialog-component v-show="isDeleteMode"
        :item="currentItem"
        item-name="Cause"
        store-action-name="Causes/deleteItem"
        @close-dialog="isDeleteMode = false"
        @item-deleted="onDeleteItem"
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
import ContactSelectComponent from '../../common/ContactSelectComponent';
import DistClassSelectComponent from '../../common/DistClassSelectComponent';

export default {
  components: {
    ItemDeleteDialogComponent,
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

  methods: {
    newForm() {
      return {
        id: null,
        cause_group_id: null,
        contact_id: null,
        distribution_class_id: null,
        name: '',
        note: '',
      };
    },

    async saveItem() {
      const result = await this.$store.dispatch('Causes/addData', this.form);
      return result;
    },

    async updateItem() {
      const result = await this.$store.dispatch('Causes/updateData', this.form);
      return result;
    },
  },
};
</script>

<style>

</style>