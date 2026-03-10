// Global auth middleware — runs on every route change
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return // Skip on SSR, handled client-side
  if (to.path === '/login') return // Allow login page through
  if (to.path === '/download') return // Allow login page through

  const token = localStorage.getItem('admin_token')
  if (!token) {
    return navigateTo('/login')
  }
})
