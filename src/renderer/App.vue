<template>
  <div id="app">
    <main class="dashboard-wrapper" id="main">
      <div class="dashboard" id="main-content">
        <nav class="nav tabs-top-nav overflow-hidden">
          <router-link class="nav-link" active-class="active" to="register">
            <i class="icon-class-comment"></i> Register
          </router-link>
          <router-link class="nav-link" active-class="active" to="lists">
            <i class="icon-case"></i> Lists
          </router-link>
          <router-link class="nav-link" active-class="active" to="contacts">
            <i class="icon-classes"></i> Contacts
          </router-link>
        </nav>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'npa',
  };
</script>

<style>
</style>
