<template>
  <div>
    <div class="position-relative mb-2">
      <span class="list-components__item-move" :class="{'d-none': isFiltered}">
          <i class="icon-move-dots"></i>
      </span>
      <div class="flex-table__row w-shadow expandable"
        @click="$emit('toggle-collapse-status', item)"
        @mouseover="isHover = true"
        @mouseout="isHover = false"
        :class="{'active': currentItem && currentItem.id === item.id}"
        :aria-expanded="item.isExpanded"
        :aria-controls="`cause-group-${item.id}`">
        <div class="flex-table__row-item col-8 font-weight-bold" tabindex="0">
            <span>{{ item.name }}</span>
        </div>
        <div class="flex-table__row-item col-4 d-flex
        justify-content-end pr-2"
            tabindex="0">
            <button class="btn btn-icon"
              @mouseover="isViewHover = true"
              @mouseout="isViewHover = false"
              @click.stop="$emit('view-item', item)"
            >
              <i class="icon icon-edit"></i>
            </button>
            <button v-show="item.causes.length"
              @click.stop="toggleCollapse"
              :class="{'collapsed': item.isExpanded, 'active': isHover && !isViewHover}"
              :aria-expanded="item.isExpanded"
              :aria-controls="`cause-group-${item.id}`"
              class="btn btn-icon"
            >
              <i class="icon-minus" v-if="item.isExpanded" :key="`plus-${item.id}`">
              </i>
              <i class="icon-plus" v-else :key="`minus-${item.id}`">
              </i>
            </button>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
    currentItem: {
      type: Object,
      default: null,
    },
    isFiltered: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isViewHover: false,
      isHover: false,
    };
  },

  methods: {
    toggleCollapse() {
      this.$emit('toggle-collapse', this.item);
    },
  },
};
</script>

<style>

</style>