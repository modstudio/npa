<template>
  <div class="order-1">
    <input ref="datepicker"
      v-model="date"
      @change="onChange"
      class="form-control"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Date,
      default: null,
    },
  },

  watch: {
    value(newDate) {
      if (newDate) {
        this.date = this.$root.formatDate(newDate);
      } else {
        this.date = null;
      }
    },
  },

  data() {
    return {
      date: null,
      calendar: null,
    };
  },

  mounted() {
    this.calendar = $(this.$refs.datepicker).flexcal({
      position: 'bl',
      duration: 50,
      calendars: ['he-jewish', 'en'],
      commit: (event, date) => {
        this.$emit('input', date);
      },
      hidden: () => this.$emit('blur'),
    });
  },

  methods: {
    onChange() {
      const date = this.calendar.flexcal('parse', this.date);
      if (date.toString() === 'Invalid Date') {
        this.date = null;
        this.$emit('input', null);
      } else {
        this.$emit('input', date);
      }
    },

    click() {
      this.$refs.datepicker.click();
    },
  },
};
</script>

<style>
.ui-textpopup-box {
  z-index: 10;
}
table.ui-widget-content caption {
  caption-side: top;
  text-align: -webkit-center;
}
</style>
