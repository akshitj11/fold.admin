// Composable for making authenticated API requests to the admin backend
export function useApi() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl
  const router = useRouter()

  function getToken(): string | null {
    if (import.meta.client) {
      return localStorage.getItem('admin_token')
    }
    return null
  }

  function isTokenExpired(token: string): boolean {
    try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? ''))
      return payload.exp && payload.exp < Math.floor(Date.now() / 1000)
    } catch {
      return true
    }
  }

  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null }> {
    const token = getToken()

    // Proactively check expiry before making the request
    if (token && isTokenExpired(token)) {
      if (import.meta.client) localStorage.removeItem('admin_token')
      router.push('/login')
      return { data: null, error: 'Session expired' }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {})
    }
    try {
      const res = await fetch(`${baseUrl}/api/admin${path}`, { ...options, headers })
      const json = await res.json()
      // If the server returns 401, clear token and redirect
      if (res.status === 401) {
        if (import.meta.client) localStorage.removeItem('admin_token')
        router.push('/login')
        return { data: null, error: 'Session expired' }
      }
      if (!res.ok) return { data: null, error: json.error || 'Request failed' }
      return { data: json.data ?? json, error: null }
    } catch (e: any) {
      return { data: null, error: e.message || 'Network error' }
    }
  }

  return { request }
}
