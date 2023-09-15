<script setup lang="ts">

</script>

<template>
  <div class="app-wrapper">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<style lang="less" scoped>
@import "@/styles/mixin.less";
.app-wrapper {
  .clearfix();
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
