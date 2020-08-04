<template>
  <div class="d-flex justify-content-end align-items-center">
    <button type="button" v-if="isNewMode"
      class="btn btn-icon btn-icon--w-text mr-auto"
      @click="$emit('cancel')">
        <i class="icon icon-e-remove"></i><span>Cancel</span>
    </button>
    <button type="button" v-else
      @click="$emit('delete')"
      class="btn btn-icon btn-icon--w-text mr-auto">
      <template v-if="isInactive">
        <i class="icon icon-check icon-sm"></i>
        <span>Make active</span>
      </template>
      <template v-else-if="hasAssociation">
        <i class="icon icon-trash-can"></i><span>Archive</span>
      </template>
      <template v-else-if="hasAssociation !== null">
        <i class="icon icon-bin"></i><span>Delete</span>
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
    isInactive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>

</style>
