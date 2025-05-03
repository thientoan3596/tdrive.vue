<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <!-- <header>Header Section</header> -->
  <RouterView :key="$route.fullPath" />
  <ConfirmDialog></ConfirmDialog>
  <Toast />
</template>

<style scoped></style>
