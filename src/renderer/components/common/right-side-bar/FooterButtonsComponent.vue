<template>
  <div class="d-flex justify-content-end align-items-center">
    <button type="button" v-if="isNewMode"
      class="btn btn-link mr-auto"
      @click="$emit('cancel')">
        Cancel
    </button>
    <button type="button" v-else
      @click="$emit('delete')"
      class="btn btn-icon btn-icon--w-text mr-auto">
      <template v-if="hasAssociation">
        <i class="icon icon-bin"></i><span>Archive</span>
      </template>
      <template v-else-if="hasAssociation !== null">
        <i class="icon icon-trash-can"></i><span>Delete</span>
      </template>
    </button>

    <action-button
      button-name="Save and New"
      loading-name="Saving"
      additional-class="btn-secondary w-156"
      @click="$emit('save-and-new')"
      :form-busy="isSavingAndNewProcess"
    >
    </action-button>
    <action-button
      button-name="Save and Close"
      loading-name="Saving"
      additional-class="w-156 ml-4"
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
    hasAssociation: {
      type: Boolean,
      default: null,
    },
  },
};
</script>

<style>

</style>
