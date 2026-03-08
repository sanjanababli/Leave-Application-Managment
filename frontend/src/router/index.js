import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import EmployeeDashboard from '../views/EmployeeDashboard.vue'
import EmployerDashboard from '../views/EmployerDashboard.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/employee', component: EmployeeDashboard, meta: { requiresAuth: true } },
  { path: '/employer', component: EmployerDashboard, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (to.meta.requiresAuth && !token) return next('/login')
  if ((to.path === '/login' || to.path === '/signup') && token && user) {
    return next(user.role === 'employer' ? '/employer' : '/employee')
  }
  next()
})

export default router