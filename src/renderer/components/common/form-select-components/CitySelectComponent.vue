<template>
  <select-component
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
    :source-data="data"
    @change="onChange"
  >
    <template v-slot:option>
      <option class="color-neutral-500"
        data-icon="icon icon-e-add"
        :value="-1"
      >
        Add new city
      </option>      
    </template>
  </select-component>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
  },

  computed: {
    data() {
      return this.$store.getters['Cities/data']
        .map((item) => {
          const subtext = [item.country];
          if (item.zip) {
            subtext.unshift(item.zip);
          }
          if (item.state) {
            subtext.unshift(item.state);
          }
          return {
            value: item.id,
            label: item.city,
            subtext: subtext.join(', '),
            name: `${item.city} ${subtext.join()}`,
            disabled: (item.is_inactive === 1),
            ...item,
          };
        });
    },
  },

  created() {
    this.initData();
  },

  methods: {
    initData() {
      if (!this.data.length) {
        this.$store.dispatch('Cities/getData');
      }
    },

    onChange(value, selectedData, previousValue) {
      if (value === -1) {
        this.$nextTick(() => {
          this.$emit('input', Number(previousValue));
        });
        this.$emit('add-new');
      }
    },
  },
};
</script>

<style>

</style>