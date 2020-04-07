<template>
  <div class="upload-area d-flex justify-content-center align-items-center 
    text-large color-neutral-600"
    ref="fileform"
    @click="$refs.fileInput.click()"
  >
    Drag file or click here to upload
    <input type="file"
      ref="fileInput"
      :accept="accept"
      @change="onChangeFile"
      class="d-none">
  </div>
</template>

<script>
import dragAndDropMixin from '../mixins/drag-end-drop';

export default {
  props: {
    accept: {
      type: String,
      default: null,
    },
  },

  mixins: [dragAndDropMixin],

  mounted() {
    if (this.dragAndDropCapable) {
      /*
          Add an event listener for drop to the form
      */
      this.$refs.fileform.addEventListener('drop', this.onDropEvent);
    }
  },

  methods: {
    onDropEvent(e) {
      this.emitEvent(e.dataTransfer.files[0]);
    },

    onChangeFile(e) {
      this.emitEvent(e.target.files[0]);
    },

    emitEvent(file) {
      this.$emit('input', file);
      this.$emit('change', file);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../../assets/sass/variables/colors';
  .upload-area {
    width: 390px;
    height: 134px;
    background-color: $color-neutral-50;
    border-radius: 3px;
    border: dotted 1px #979797;
    cursor: pointer;
  }
</style>