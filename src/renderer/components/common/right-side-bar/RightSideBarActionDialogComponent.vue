<template>
  <div>
    <div class="info-sidebar__block-title mb-4">
      <slot name="title"></slot>
    </div>
    <div class="info-sidebar__block-subtitle">
      <slot name="subtitle"></slot>
    </div>
    <div class="info-sidebar__block-buttons">
      <div class="row gutter-16">
          <div class="col-6">
              <!-- Cancel Button -->
              <button type="button" class="btn btn-block btn-secondary" @click="cancelClick">
                  <slot name="cancelButtonName">Cancel</slot>
              </button>
          </div>
          <div class="col-6">
              <!-- Make Button -->
              <button type="submit" class="btn btn-block btn-primary"
                      @click.prevent="makeClick"
                      :disabled="form.busy">

                  <span v-if="form.busy">
                      <div class="loader">
                          <div class="loader__dot"></div>
                          <div class="loader__dot"></div>
                          <div class="loader__dot"></div>
                      </div>
                      Processing
                  </span>
                  <span v-else>
                    <slot name="makeButtonName"></slot>
                  </span>
              </button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  methods: {
    cancelClick() {
      this.$emit('cancelclick');
    },

    makeClick() {
      this.$emit('makeclick');
    },
  },
};
</script>
