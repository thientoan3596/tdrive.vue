<template>
  <div class="w-full bg-green-400 relative">
    <div class="pt-1 pb-2 mx-3 sticky top-0">
      <div class="flex justify-end gap-2">
        <div class="w-1/3 flex justify-center">
          <router-link :to="{ path: '/home', force: true }" role="button">Home</router-link>
        </div>
        <div class="w-1/3 flex justify-end">
          <Avatar
            ref="avatar"
            icon="pi pi-user"
            class="mr-2 cursor-pointer"
            shape="circle"
            @click="toggleUserCtxMenu"
          />
          <Menu ref="userCtxMenu" :model="userCtxMenuItems" :popup="true" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Avatar, Menu } from 'primevue'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useJwt } from '@/composables/useJwt'
const router = useRouter()
const { clearTokens } = useJwt()
const user = useUserStore()
const currentUser = ref()
const userCtxMenu = ref()
const avatar = ref()
const userCtxMenuItems = [
  { label: 'Logout', icon: 'pi pi-sign-out', command: () => handleLogout() },
]
const toggleUserCtxMenu = (event: MouseEvent) => {
  userCtxMenu.value.toggle(event)
}
function handleLogout() {
  user.setUser({ name: '', role: '', id: '' })
  location.replace('/login')
  clearTokens()
}
onMounted(() => {
  currentUser.value = {
    name: 'Thluon',
  }
  avatar.value.$el.innerText = 'T'
})
</script>
