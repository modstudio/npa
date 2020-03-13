<template>
  <div class="d-flex justify-content-between">
    <button type="button" v-if="isNewMode"
      class="btn btn-link"
      @click="$emit('cancel')">
        Cancel
    </button>
    <button type="button" v-else
      @click="$emit('delete')"
      class="btn btn-icon btn-icon--w-text my-auto">
      <span>
        <i class="icon-delete"></i>Delete
      </span>
    </button>

    <action-button
      button-name="Save and New"
      loading-name="Saving"
      additional-class="btn-secondary w-160"
      @click="$emit('save-and-new')"
      :form-busy="isSavingAndNewProcess"
    >
    </action-button>
    <action-button
      button-name="Save and Close"
      loading-name="Saving"
      additional-class="w-160"
      @click="$emit('save-and-close')"
      :form-busy="isSavingAndCloseProcess"
    >
    </action-button>
  </div>  
</template>

<script>
export default {
  props: {
    isNewMode: {
      type: Boolean,
      default: false,
    },
    isSavingAndNewProcess: {
      type: Boolean,
      default: false,
    },
    isSavingAndCloseProcess: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>

</style>