<template>
  <div class="m-4">
    <aside class="sidebar">
      <div class="color-neutral-500 m-3">
        <h4>Sidebar panel</h4>
        register page
      </div>
    </aside>    

    <h3>Register Page</h3>
    <p class="mt-4">List of created tables:</p>
    <div v-for="(table, index) in tables" :key="index">{{table.name}}</div>
  </div>
</template>

<script>
import EventBus from '../shared/EventBus';

export default {
  data() {
    return {
      tables: null,
    };
  },

  created() {
    EventBus.$on('db-init', this.getCreatedTables);
  },

  destroyed() {
    EventBus.$off('db-init', this.getCreatedTables);
  },

  methods: {
    // get list of created table for demo purpose only
    async getCreatedTables() {
      this.tables = await this.$db.all('SELECT name FROM sqlite_master order by name');
    },
  },
};
</script>

<style>

</style>