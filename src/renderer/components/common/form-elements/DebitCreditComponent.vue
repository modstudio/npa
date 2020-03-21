<template>
  <div class="form-group">
    <label>{{label}}</label>
    <div class="row gutter-16">
      <div class="col-12 col-sm-6">
        <radio-input-component
          name="is_auto_renew"
          radio-value="credit"
          :value="value"
          label="Credit"
          type="String"
          form-group-class="mb-3 mb-sm-0"
          v-on="$listeners"
        >
        </radio-input-component>
      </div>
      <div class="col-12 col-sm-6">
        <radio-input-component
          name="is_auto_renew"
          radio-value="debit"
          :value="value"
          type="String"
          label="Debit"
          v-on="$listeners"        
        >
        </radio-input-component>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Balance',
    },
    value: {
      type: String,
      default: 'debit',
    },
  },
};
</script>

<style>

</style>