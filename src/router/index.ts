import { createRouter, createWebHistory } from 'vue-router'
import SignUpView from '@/views/SignUpView.vue'
import FormTestView from '@/views/FormTestView.vue'
import MainView from '@/views/MainView.vue'

import { useJwt } from '@/composables/useJwt'
import { useUserStore } from '@/stores/userStore'
import SignInView from '@/views/SignInView.vue'
import SignOut from '@/views/SignOut.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      alias: ['/index', '/'],
      name: 'main',
      component: MainView,
    },
    {
      path: '/folder/:id',
      name: 'folder',
      component: MainView,
    },
    {
      path: '/signup',
      alias: ['/register'],
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/test',
      name: 'test',
      component: FormTestView,
    },
    {
      path: '/signin',
      alias: ['/login'],
      name: 'signin',
      component: SignInView,
    },
    {
      path: '/logout',
      alias: ['/signout'],
      name: 'logout',
      component: SignOut,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})
router.beforeEach(async (to, _, next) => {
  const user = useUserStore()
  const { decodeJwt } = useJwt()
  await decodeJwt()
  const isAuthenticated = !!user.isAuthenticated
  if (to.name == 'about') return next()
  if (
    isAuthenticated &&
    ['register', 'signup', 'login', 'signin'].includes(to.name?.toString() || '')
  )
    return next('/')
  if (['register', 'signup', 'login', 'signin'].includes(to.name?.toString() || '')) return next()
  if (!isAuthenticated) return next('login')
  return next()
})
export default router
