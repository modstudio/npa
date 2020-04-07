<template>
  <div>
    <div class="info-sidebar__body">
      <div class="info-sidebar__block-title mb-4">
        Are you sure you want to import this file, this will overwrite all your current data?
      </div>
      <div class="text-center">
        <span class="subtext">
          This will import data from {{fileDate}}
        </span>
      </div>
    </div>
    <div class="info-sidebar__footer">
      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-block btn-secondary w-156"
          @click="$emit('close-dialog')">
            No, Cancel
        </button>

        <action-button
          button-name="Yes, Import new data"
          loading-name="Importing..."
          :form-busy="isProcessing"
          additional-class="w-156 ml-4"
          @click="importFile"
        ></action-button>
      </div>
    </div>    
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: {
    file: {
      type: File,
      default: null,
    },
  },

  computed: {
    fileDate() {
      return this.file ? moment(this.file.lastModified).format('MMM DD YYYY') : null;
    },
  },

  data() {
    return {
      isProcessing: false,
    };
  },

  methods: {
    async importFile() {
      this.isProcessing = true;
      try {
        await Vue.db.backupDb();
        await Vue.db.restoreDb(this.file.path);
        this.$root.showConfirmationMessage('DB was restored successfully!');
        this.$emit('close-dialog');
        this.isProcessing = false;
      } catch (err) {
        console.log('Error restore DB', err);
        this.isProcessing = false;
      }
    },
  },
};
</script>

<style>

</style>