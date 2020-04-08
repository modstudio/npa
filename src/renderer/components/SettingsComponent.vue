<template>
  <div>
    <right-side-bar-component v-if="isShown"
      header-image-url="./static/images/settings.svg"
      header-image-style="background-size: auto;"
      @hidepanel="hidePanel"
    >
      <template slot="header">Settings</template>
      <div>
        <div v-show="!isImportDialog">
          <div class="info-sidebar__body">
            <div class="info-sidebar__block-header">
              <h4>Import database</h4>
            </div>
            <file-upload-component
              accept=".db"
              @change="importDb"
              v-model="importFile"
            ></file-upload-component>
            <div class="info-sidebar__block-header">
              <h4>Export database</h4>
            </div>
            <button type="button" class="btn btn-icon btn-icon--w-text"
              @click="exportDb"
              :disabled="isExporting"
            >
              <i class="icon icon-Export"></i>
              <span>Export</span>
              <loader-component :is-shown="isExporting"></loader-component>
            </button>           
          </div>
          <div class="info-sidebar__footer">
            <div class="d-flex justify-content-end">
              <action-button
                button-name="Save and close"
                loading-name="Saving"
                :form-busy="isProcessing"
                additional-class="w-156 ml-4"
                @click="save"
              ></action-button>
            </div>
          </div>
        </div>
        <import-dialog-component v-show="isImportDialog"
          :file="importFile"
          @close-dialog="closeImportDialog"
        ></import-dialog-component>        
      </div>
    </right-side-bar-component>
  </div>
</template>

<script>
import Vue from 'vue';
import Bus from '../shared/EventBus';
import ImportDialogComponent from './SettingsComponent/ImportDialogComponent';

export default {
  components: {
    ImportDialogComponent,
  },

  data() {
    return {
      isShown: false,
      isProcessing: false,
      isImportDialog: false,
      importFile: null,
      isExporting: false,
    };
  },
  created() {
    Bus.$on('show-settings', this.showPanel);
  },

  destroyed() {
    Bus.$off('show-settings', this.showPanel);
  },

  methods: {
    showPanel() {
      this.isShown = true;
    },

    hidePanel() {
      this.isShown = false;
      this.isImportDialog = false;
      this.importFile = null;
    },

    save() {
      this.hidePanel();
    },

    importDb() {
      if (this.importFile) {
        this.isImportDialog = true;
      }
    },

    closeImportDialog() {
      this.isImportDialog = false;
    },

    async exportDb() {
      this.isExporting = true;
      try {
        await Vue.db.backupDb();
        this.$root.showConfirmationMessage('DB was backuped successfully!');
        this.isExporting = false;
      } catch (err) {
        console.log('Error backup DB', err);
        this.isExporting = false;
      }
    },
  },
};
</script>

<style>

</style>