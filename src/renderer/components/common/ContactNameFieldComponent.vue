<template>
  <div>
    <template v-if="companyName">
      <div>{{companyName}}</div>
      <span class="subtext">{{firstName}} {{lastName}}</span>
    </template>
    <template v-else>{{firstName}} {{lastName}}</template>    
  </div>
</template>

<script>
export default {
  props: {
    companyName: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
  },
};
</script>

<style>

</style>