<template>
  <div id="app">
    <main class="dashboard-wrapper" id="main">
      <div class="dashboard" id="main-content">
        <nav class="nav tabs-top-nav overflow-hidden">
          <router-link class="nav-link" to="/register">
            <i class="icon icon-Register"></i> <span>Register</span>
          </router-link>
          <router-link class="nav-link" to="/lists">
            <i class="icon icon-Files"></i> <span>Lists</span>
          </router-link>
          <router-link class="nav-link" to="/contacts">
            <i class="icon icon-Contacts"></i> <span>Contacts</span>
          </router-link>
        </nav>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <settings-component></settings-component>
        <notification-component></notification-component>
      </div>
    </main>
  </div>
</template>

<script>
import SettingsComponent from './components/SettingsComponent';
import NotificationComponent from './components/common/NotificationComponent';

export default {
  name: 'npa',

  components: {
    SettingsComponent,
    NotificationComponent,
  },
};
</script>

<style>
</style>
