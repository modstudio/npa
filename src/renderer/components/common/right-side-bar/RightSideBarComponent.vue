<template>
  <transition name="rightSideBar">
    <div class="info-sidebar" :class="additionalClass" ref="rightSideBar">
        <div class="info-sidebar__header">
            <button type="button" class="info-sidebar__close"
              @click="hidePanel">
                <i class="icon-close"></i>
            </button>
            <span class="info-sidebar__image">
                <span role="img" class="profile-photo-preview"
                  :style="'background-image: url(' + headerImageUrl +');' + headerImageStyle">
                </span>
            </span>
            <slot name="header"></slot>
        </div>
        <slot></slot>
        <div class="info-sidebar__footer py-3 px-4">
          <slot name="footer"></slot>
        </div>
    </div>
  </transition>
</template>

<script>
const mixinScrollBar = require('../../mixins/scroll-bar');

export default {
  props: {
    headerImageUrl: {
      type: String,
      default: '',
    },
    headerImageStyle: {
      type: String,
      default: '',
    },
    additionalClass: {
      type: String,
      default: null,
    },
  },

  mixins: [mixinScrollBar],

  /**
     * The component's data.
     */
  data() {
    return {
      scrollBarOptions: { autoHideScrollbar: true, alwaysShowScrollbar: 0 },
    };
  },

  mounted() {
    this.$_openPanel();
  },

  beforeDestroy() {
    this.$nextTick(() => {
      this.unbindScrollBarFromEl(this.$refs.rightSideBar);
    });
  },

  methods: {
    hidePanel() {
      this.$emit('hidepanel');
    },

    $_openPanel() {
      this.$nextTick(() => {
        this.bindScrollBarToEl(this.$refs.rightSideBar, this.scrollBarOptions);
      });
    },

  },
};
</script>
