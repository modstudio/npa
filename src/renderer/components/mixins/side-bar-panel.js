export default {
  props: {
    currentItem: {
      type: Object,
      default: null,
    },
    isShown: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: null,
    },
  },

  watch: {
    isShown() {
      this.initForm();
    },

    currentItem() {
      this.initForm();
    },
  },

  computed: {
    isNewMode() {
      return this.mode === 'new';
    },
  },

  data() {
    return {
      form: null,
      isSavingAndNewProcess: false,
      isSavingAndCloseProcess: false,
      isDeleteMode: false,
    };
  },

  created() {
    this.initForm();
  },

  methods: {
    initForm() {
      if (this.$refs.observer) {
        this.$refs.observer.reset();
      }
      if (this.$refs.form) {
        this.$root.scrollUp(this.$refs.form);
      }
      this.form = this.newForm();
      if (!this.isNewMode && this.currentItem) {
        this.form = { ...this.currentItem };
      }
    },

    newForm() {
      return {};
    },

    async saveAndNew() {
      this.isSavingAndNewProcess = true;
      const result = await this.save();
      this.isSavingAndNewProcess = false;
      if (result) {
        this.$emit('update');
        if (this.isNewMode) {
          this.initForm();
        } else {
          this.$emit('add-new');
        }
      }
    },

    async saveAndClose() {
      this.isSavingAndCloseProcess = true;
      const result = await this.save();
      this.isSavingAndCloseProcess = false;
      if (result) {
        this.$emit('update');
        this.$emit('hidepanel');
      }
    },

    async save() {
      const isValidateSuccess = await this.$refs.observer.validate();
      if (!isValidateSuccess) {
        this.$root.scrollToFirstError(this.$refs.form, true);
        return false;
      }
      if (this.isNewMode) {
        const result = this.saveItem();
        return result;
      }
      const result = this.updateItem();
      return result;
    },

    /**
     * Save Item to store
     * @returns result
     */
    saveItem() {

    },

    /**
     * Update current item
     * @return result
     */
    updateItem() {

    },

    cancel() {
      this.$emit('hidepanel');
    },

    deleteAction() {
      this.isDeleteMode = true;
    },

    onDeleteItem() {
      this.$emit('update');
      this.$emit('hidepanel');
      this.isDeleteMode = false;
    },
  },
};
