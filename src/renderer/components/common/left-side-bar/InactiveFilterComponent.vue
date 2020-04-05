<template>
  <filter-component
    v-bind="$attrs" 
    v-on="$listeners"
    :is-multiple-select="false"
    name-filter="Inactive"
    name-all-item="Exclude notes"
    :default-id="0"
    source-type="static"
    :source="[{id: 0, name: 'Active only'},
              {id: 1, name: 'Show inactive'},
              {id: 2, name: 'Inactive only'}]"
  ></filter-component>
</template>

<script>

</script>

<style>

</style>