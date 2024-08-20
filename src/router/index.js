import { createRouter, createWebHistory } from 'vue-router'
import { checkLogin } from '../utils/AuthUtils'

const routes = [
  {
    path: '/',
    name: 'FirstPage',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/MainPage.vue')
  },
  {
    path: '/real-time',
    name: 'Real-Time',
    component: () => import('../views/Real-Time-Page.vue')
  },
  {
    path: '/error-page',
    name: 'Error',
    component: () => import('../views/ErrorPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 任何頁面都先檢查用戶是否已登入
router.beforeEach(async (to) => {
  try {
    if (to.name !== 'Login' && to.name !== 'Error') {
      const isLoggedIn = await checkLogin();
      if (!isLoggedIn) {
        return { name: 'Login' };
      }
    } else if (to.name === 'Login') {
      const isLoggedIn = await checkLogin();
      if (isLoggedIn) {
        return { name: 'Main' }
      }
    }
  } catch (error) {
    console.error('Navigation guard error:', error);
    return { name: 'Error', params: { message: '服務暫時不可用，請稍後再試。' } };
  }
});

export default router
