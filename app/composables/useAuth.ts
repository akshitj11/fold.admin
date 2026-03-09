// Auth composable — handles login, logout, and session state
export function useAuth() {
  const router = useRouter()
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl

  function getToken(): string | null {
    if (import.meta.client) return localStorage.getItem('admin_token')
    return null
  }

  function setToken(token: string) {
    if (import.meta.client) localStorage.setItem('admin_token', token)
  }

  function clearToken() {
    if (import.meta.client) localStorage.removeItem('admin_token')
  }

  function isLoggedIn(): boolean {
    return !!getToken()
  }

  async function login(username: string, password: string): Promise<string | null> {
    try {
      const res = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const json = await res.json()
      if (!res.ok) return json.error || 'Login failed'
      setToken(json.data.token)
      return null
    } catch (e: any) {
      return e.message || 'Network error'
    }
  }

  function logout() {
    clearToken()
    router.push('/login')
  }

  return { login, logout, isLoggedIn, getToken }
}
