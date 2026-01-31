import { createRouter, createWebHistory } from 'vue-router'
import { usuario } from '@/services/authFirebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
      meta: { requierEmailVerified: true },
    },
    {
      path: '/mykanban',
      component: () => import('@/views/DashBoard.vue'),
      meta: { requierEmailVerified: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requierEmailVerified && !usuario) {
    return '/login'
  } else if (to.meta.requierEmailVerified && !usuario.value?.emailVerified) {
    return '/login'
  }
})

export default router
