// Global auth middleware — runs on every route change
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return // Skip on SSR, handled client-side
  if (to.path === '/login') return // Allow login page through
  if (to.path === '/download') return // Allow public download page through

  const token = localStorage.getItem('admin_token')
  if (!token) return navigateTo('/login')

  // Decode JWT payload to check expiry (no signature verification needed client-side)
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? ''))
    const nowSeconds = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < nowSeconds) {
      localStorage.removeItem('admin_token')
      return navigateTo('/login')
    }
  } catch {
    // Malformed token — clear and redirect
    localStorage.removeItem('admin_token')
    return navigateTo('/login')
  }
})
