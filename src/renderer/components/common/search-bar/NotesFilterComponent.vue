<template>
  <filter-component
    v-bind="$attrs" 
    v-on="$listeners"
    :is-multiple-select="false"
    name-filter="Notes"
    name-all-item="Exclude notes"
    :default-id="0"
    source-type="static"
    :source="[{id: 0, name: 'Exclude notes'},
              {id: 1, name: 'Include notes'},
              {id: 2, name: 'Notes only'}]"
  ></filter-component>
</template>

<script>

</script>

<style>

</style>