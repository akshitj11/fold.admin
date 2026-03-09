// Composable for making authenticated API requests to the admin backend
export function useApi() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl

  function getToken(): string | null {
    if (import.meta.client) {
      return localStorage.getItem('admin_token')
    }
    return null
  }

  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null }> {
    const token = getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {})
    }
    try {
      const res = await fetch(`${baseUrl}/api/admin${path}`, { ...options, headers })
      const json = await res.json()
      if (!res.ok) return { data: null, error: json.error || 'Request failed' }
      return { data: json.data ?? json, error: null }
    } catch (e: any) {
      return { data: null, error: e.message || 'Network error' }
    }
  }

  return { request }
}
