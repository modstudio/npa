<template>
  <div class="m-4">
    <layouts-container-lg-component>
      <div class="d-flex mb-5">
        <div class="nav tabs-inner tabs-inner--sm align-self-center d-none d-sm-flex">
          <router-link to='cause' tag="button" class="tabs-inner__link">
            Cause
          </router-link>
          <router-link to='pledge' tag="button" class="tabs-inner__link">
            Pledge
          </router-link>
          <router-link to='loan' tag="button" class="tabs-inner__link">
            Loan
          </router-link>
          <router-link to='pikadon' tag="button" class="tabs-inner__link">
            Pikadon
          </router-link>
          <router-link to='dist-class' tag="button" class="tabs-inner__link">
            Dist.Class
          </router-link>
          <router-link to='trx-method' tag="button" class="tabs-inner__link">
            Trx.Method
          </router-link>
        </div>
      </div>
      <router-view></router-view>
    </layouts-container-lg-component>
  </div>
</template>

<script>
export default {

};
</script>

<style>

</style>
