<template>
  <notifications group="app"
      position="top right"
  >
      <template slot="body" slot-scope="props">
          <div class="app-notification">
              <span class="checkmark-circle"><i class="icon icon-Register"></i></span>
              <div class="app-notification__content" v-html="props.item.text">
              </div>
              <a class="close" @click="props.close">
                  <i class="icon icon-e-remove"></i>
              </a>
          </div>
      </template>
  </notifications>  
</template>

<script>
export default {

};
</script>

<style>

</style>