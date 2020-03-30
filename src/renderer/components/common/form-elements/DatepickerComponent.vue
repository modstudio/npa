<template>
  <ValidationProvider :name="label" :rules="rules" v-slot="{ errors }">
    <div class="form-group form-group--enter">
        <el-date-picker
          v-if="isGeorgian"
          ref="datepicker"
          class="order-1 text-small w-auto"
          :value="value"
          :name="name"
          type="date"
          format="MM/dd/yyyy"
          @input="onInput"
          v-on="$listeners"
        ></el-date-picker>
        <input ref="datepicker" 
          v-else-if="isJewish"
          class="form-control"
          :value="formatedValue"
          :name="name"
        />
        <label v-if="label">
            {{ label }}
        </label>

        <span class="state state--error" v-show="errors[0]">
            {{ errors[0] }}
        </span>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    value: {
      type: Date,
      default: null,
    },
    name: {
      type: String,
      default: 'name',
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    additionalClass: {
      type: Object,
      default: null,
    },
    calendar: {
      type: String,
      default: 'jewish', // georgian or jewish
    },
  },

  mounted() {
    if (this.isJewish) {
      $(this.$refs.datepicker).flexcal({
        position: 'bl',
        calendars: ['jewish'],
        commit: (event, date) => {
          this.onInput(date);
        },
        hidden: () => this.$emit('blur'),
      });
    }
  },

  computed: {
    isGeorgian() {
      return this.calendar === 'georgian';
    },

    isJewish() {
      return this.calendar === 'jewish';
    },

    formatedValue() {
      if (!this.value) {
        return '';
      }
      if (typeof (this.value) === 'string') {
        return this.value;
      }
      return moment(this.value).format('MM/DD/YYYY');
    },
  },

  methods: {
    onInput(value) {
      this.$emit('input', value);
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
