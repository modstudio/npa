<template>
  <ValidationProvider :name="$attrs.label" :rules="$attrs.rules" v-slot="{ errors }">
    <base-select-component :error="errors[0]" v-bind="$attrs" v-on="$listeners">
      <!-- pass through normal slots -->
      <template v-for="(_, slotName) in $slots" v-slot:[slotName]>
        <slot :name="slotName" />
      </template>
    </base-select-component>
  </ValidationProvider>
</template>

<script>
import BaseSelectComponent from './BaseSelectComponent';

export default {
  components: {
    BaseSelectComponent,
  },
};
</script>

<style>

</style>