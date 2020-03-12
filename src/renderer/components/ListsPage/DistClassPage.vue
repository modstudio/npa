<template>
  <div>
    <aside class="sidebar">
      <div class="color-neutral-500 m-3">
        <h4>Sidebar panel</h4>
        of {{$route.name}} page
      </div>
    </aside> 
      <div class="d-flex">
        <div class="flex-grow-1">
          {{data.length}} total
        </div>
        <button type="button" class="btn btn-secondary" @click="addDistClass">
          Add Dist. Class
        </button>
      </div>
  </div>
</template>

<script>
export default {

  data() {
    return {

    };
  },

  computed: {
    data() {
      return [];
    },
  },

  methods: {
    addDistClass() {

    },
  },
};
</script>

<style>

</style>