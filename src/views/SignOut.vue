<template></template>
<script setup lang="ts">
import { useJwt } from '@/composables/useJwt'
const { clearTokens } = useJwt()
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue'
const user = useUserStore()
function handleLogout() {
  user.setUser({ name: '', role: '', id: '' })
  location.replace('/register')
  clearTokens()
}
onMounted(() => {
  handleLogout()
})
</script>
