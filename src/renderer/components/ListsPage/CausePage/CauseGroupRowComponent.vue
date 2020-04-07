<template>
  <div>
    <div class="position-relative">
      <span class="list-components__item-move" :class="{'d-none': isFiltered}">
          <i class="icon icon-drag"></i>
      </span>
      <div class="flex-table__row w-shadow expandable"
        @click="toggleCollapse"
        @mouseover="isHover = true"
        @mouseout="isHover = false"
        :class="{'active': currentItem && currentItem.id === item.id}"
        :aria-expanded="item.isExpanded"
        :aria-controls="`cause-group-${item.id}`">
        <div class="flex-table__row-item col-10" tabindex="0">
          <div class="d-flex mr-2">
            <div class="font-weight-bold">{{ item.name }}</div>
            <span class="color-neutral-500 ml-3"
              :class="{'pr-3': !item.causes.length}">
              {{item.causes.length}} Cause<span
                v-if="item.causes.length > 1">s</span>
            </span>
          </div>
          <inactive-badge-component v-if="item.is_inactive"></inactive-badge-component>          
        </div>
        <div class="flex-table__row-item col-2 d-flex
        justify-content-end"
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
              <i class="icon icon-s-delete" v-if="item.isExpanded" :key="`plus-${item.id}`">
              </i>
              <i class="icon icon-s-add" v-else :key="`minus-${item.id}`">
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