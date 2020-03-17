<template>
  <transition name="rightSideBar">
    <div class="info-sidebar" :class="additionalClass" ref="rightSideBar">
        <div class="info-sidebar__header">
            <button type="button" class="info-sidebar__close"
              @click="hidePanel">
                <i class="icon icon-e-remove"></i>
            </button>
            <span class="info-sidebar__image">
                <span role="img" class="profile-photo-preview"
                  :style="'background-image: url(' + headerImageUrl +');' + headerImageStyle">
                </span>
            </span>
            <div class="flex-grow-1">
              <slot name="header"></slot>
            </div>
            <div class="badge badge-info rounded">
              <slot name="headerBadge"></slot>
            </div>
        </div>
        <slot></slot>
        <div class="info-sidebar__footer">
          <slot name="footer"></slot>
        </div>
    </div>
  </transition>
</template>

<script>
import bus from '../../../shared/EventBus';

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
    initEventName: {
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

  created() {
    if (this.initEventName) {
      bus.$on(this.initEventName, this.$_initPanel);
    }
  },

  destroyed() {
    if (this.initEventName) {
      bus.$on(this.initEventName, this.$_initPanel);
    }
  },

  mounted() {
    this.$_initPanel();
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

    $_initPanel() {
      this.$nextTick(() => {
        this.bindScrollBarToEl(this.$refs.rightSideBar, this.scrollBarOptions);
      });
    },

  },
};
</script>
