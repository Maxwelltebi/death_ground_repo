import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import LandingPage from '../views/LandingPage.vue';
import AuthPage from '../views/AuthPage.vue';
import DashboardPage from '../views/DashboardPage.vue';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/auth');
  } else if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
