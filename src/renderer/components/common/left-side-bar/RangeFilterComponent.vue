<template>
  <div ref="filter"
    class="dropdown search-nav-block__item search-nav-block__dropdown show-tick mx-auto mb-2"
    :class="{show: isExpanded}"
  >
      <button class="btn dropdown-toggle"
        ref="toggleButton"
        type="button"
        tabindex="0"
        data-toggle="collapse" aria-expanded="false"
        :class="{'active': isActiveFilter}"
        @click="toggleFilter"
      >
        <span class="text-small">{{nameFilter}}</span>
      </button>
      <b-collapse v-model="isExpanded" @shown="onShown">
        <div class="search-nav-block__item-range" v-if="type === 'date'">
          <div class="flex-grow-1 mr-1">
            <label>From</label>
            <datepicker-component ref="from"
              :value="fromValue"
              @input="onInputFrom"
              @blur="onBlurDatePicker"
            ></datepicker-component>
          </div>
          <div class="flex-grow-1 ml-1">
            <label>To</label>
            <datepicker-component ref="to"
              :value="toValue"
              @input="onInputTo"
              @blur="onBlurDatePicker"
            ></datepicker-component>
          </div>
        </div>
        <div class="search-nav-block__item-range" v-else>
          <div class="flex-grow-1 mr-1">
            <label>From</label>
            <input type="number" ref="from"
              class="form-control form-control--enter"
              :value="fromValue"
              @input="onInputFrom"
              @blur="onBlurInput"
              @change="$emit('filter')"
            >
          </div>
          <div class="flex-grow-1 ml-1">
            <label>To</label>
            <input type="number" ref="to"
              class="form-control form-control--enter"
              :value="toValue"
              @input="onInputTo"
              @blur="onBlurInput"
              @change="$emit('filter')"
            >
          </div>
        </div>
      </b-collapse>
  </div>
</template>

<script>
import EventBus from '../../../shared/EventBus';

export default {
  props: {
    nameFilter: {
      type: String,
      default: '',
    },
    value: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: 'number',
      validator: value => ['number', 'date'].includes(value),
    },
    collapseEvent: {
      type: String,
      default: null,
    },
  },

  computed: {
    isActiveFilter() {
      return this.value;
    },

    fromValue() {
      return this.value ? this.value.from : null;
    },

    toValue() {
      return this.value ? this.value.to : null;
    },
  },

  data() {
    return {
      isExpanded: false,
    };
  },

  created() {
    if (this.collapseEvent) {
      EventBus.$on(this.collapseEvent, this.collapseFilter);
    }
  },

  destroyed() {
    if (this.collapseEvent) {
      EventBus.$off(this.collapseEvent, this.collapseFilter);
    }
  },

  methods: {
    toggleFilter() {
      this.isExpanded = !this.isExpanded;
    },

    onShown() {
      if (this.type === 'number') {
        this.$nextTick(() => this.$refs.from.focus());
      } else {
        this.$nextTick(() => this.$refs.from.$refs.datepicker.click());
      }
    },

    onBlurInput(event) {
      if (this.isActiveFilter) {
        return true;
      }
      const activeElement = event.relatedTarget;
      if (!activeElement
        || (activeElement !== this.$refs.from && activeElement !== this.$refs.to
        && activeElement !== this.$refs.toggleButton)) {
        this.isExpanded = false;
      }
      return true;
    },

    onBlurDatePicker() {
      if (this.isActiveFilter) {
        return true;
      }
      const { activeElement } = document;
      const [inputFromEl] = this.$refs.from.$refs.datepicker.$el.children;
      const [inputToEl] = this.$refs.to.$refs.datepicker.$el.children;
      if (!activeElement
        || (activeElement !== inputFromEl && activeElement !== inputToEl
        && activeElement !== this.$refs.toggleButton)) {
        this.isExpanded = false;
      }
      return true;
    },

    onInputFrom(event) {
      const value = this.type === 'number'
        ? event.target.value : event;
      if (this.value) {
        if (this.isEmptyValue(value) && this.isEmptyValue(this.value.to)) {
          this.$emit('input', null);
        } else {
          this.$emit('input', { ...this.value, from: value });
        }
      } else if (!this.isEmptyValue(value)) {
        this.$emit('input', { from: value, to: null });
      }
    },

    onInputTo(event) {
      const value = this.type === 'number'
        ? event.target.value : event;
      if (this.value) {
        if (this.isEmptyValue(value) && this.isEmptyValue(this.value.from)) {
          this.$emit('input', null);
        } else {
          this.$emit('input', { ...this.value, to: value });
        }
      } else if (!this.isEmptyValue(value)) {
        this.$emit('input', { from: null, to: value });
      }
    },

    isEmptyValue(value) {
      return value === null || value === '';
    },

    collapseFilter() {
      this.isExpanded = false;
    },
  },
};
</script>

<style>

</style>
