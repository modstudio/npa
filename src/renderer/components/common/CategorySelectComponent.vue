<template>
  <div class="position-relative">
    <select-component
      v-bind="$attrs"
      v-on="$listeners"
      :label="label"  
      :source-data="selectData"
      :is-data-group="true"
    ></select-component>
    <div class="state-icon">
      <amount-info-component v-if="transferAmount"
        :amount="transferAmount"
      ></amount-info-component>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Cause',
    },
    transferAmount: {
      type: [Number, String],
      default: null,
    },
  },

  computed: {
    data() {
      return this.$store.getters['Categories/data'];
    },

    selectData() {
      if (!this.data) {
        return [];
      }
      let currentTypeId = null;
      return this.data
        .reduce((data, item) => {
          if (currentTypeId !== item.category_type_id) {
            data.push({
              label: item.category_type_name,
              data: [{
                value: item.id,
                label: item.category_name,
                subtext: item.category_subtext,
                name: `${item.category_name} ${item.category_subtext}`,
              }],
            });
            currentTypeId = item.category_type_id;
          } else {
            data[data.length - 1].data.push({
              value: item.id,
              label: item.category_name,
              subtext: item.category_subtext,
              name: `${item.category_name} ${item.category_subtext}`,
            });
          }
          return data;
        }, []);
    },
  },

  created() {
    this.initData();
  },

  methods: {
    initData() {
      if (!this.data.length) {
        this.$store.dispatch('Categories/getData');
      }
    },
  },
};
</script>

<style scoped>
  .state-icon {
    top: 0px;
    bottom: inherit;
  }
</style>