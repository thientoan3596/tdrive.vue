<template>
  <div class="flex flex-col h-screen">
    <NavigationComp />
    <div class="flex-1 overflow-auto">
      <DriveView />
    </div>
  </div>
  <!-- <NavigationComp></NavigationComp> -->
  <!-- <DriveView></DriveView> -->
</template>
<script setup lang="ts">
import NavigationComp from '@/components/navigation/NavigationComp.vue'
import DriveView from './DriveView.vue'
</script>
