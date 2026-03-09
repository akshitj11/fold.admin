<script setup lang="ts">
import { LogOut as ForceLogout, Search, Trash2 } from 'lucide-vue-next'

const { request } = useApi()

const users = ref<any[]>([])
const total = ref(0)
const search = ref('')
const offset = ref(0)
const limit = 50
const loading = ref(true)
const actionMsg = ref('')

async function load() {
  loading.value = true
  const { data } = await request<any>(`/users?limit=${limit}&offset=${offset.value}&search=${encodeURIComponent(search.value)}`)
  if (data) { users.value = data.users; total.value = data.total }
  loading.value = false
}

onMounted(load)

let searchTimer: any
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { offset.value = 0; load() }, 350)
})

async function forceLogout(id: string, name: string) {
  if (!confirm(`Force logout ${name}?`)) return
  await request(`/users/${id}/force-logout`, { method: 'POST' })
  actionMsg.value = `Logged out ${name}`
  setTimeout(() => actionMsg.value = '', 3000)
}

async function deleteUser(id: string, name: string) {
  if (!confirm(`Permanently DELETE ${name}? This cannot be undone.`)) return
  await request(`/users/${id}`, { method: 'DELETE' })
  users.value = users.value.filter(u => u.id !== id)
  actionMsg.value = `Deleted ${name}`
  setTimeout(() => actionMsg.value = '', 3000)
}

function prev() { if (offset.value >= limit) { offset.value -= limit; load() } }
function next() { if (offset.value + limit < total.value) { offset.value += limit; load() } }
function fmtDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Users</h1>
        <p class="page-sub">{{ total.toLocaleString() }} total users</p>
      </div>
      <div class="search-wrap">
        <Search :size="14" class="search-icon" />
        <input v-model="search" placeholder="Search by name or email…" class="search-input" />
      </div>
    </div>

    <div v-if="actionMsg" class="action-toast">{{ actionMsg }}</div>

    <div class="table-card">
      <div v-if="loading" class="loading">Loading users…</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
            <th>Streak</th>
            <th>Entries</th>
            <th>Push</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>
              <NuxtLink :to="`/users/${u.id}`" class="user-link">
                <div class="avatar">{{ u.name[0] }}</div>
                {{ u.name }}
              </NuxtLink>
            </td>
            <td class="muted">{{ u.email }}</td>
            <td>{{ u.foldScore ?? '—' }}</td>
            <td>{{ u.currentStreak ?? '—' }}d</td>
            <td>{{ u.totalEntries ?? '—' }}</td>
            <td><span :class="u.pushToken ? 'badge-on' : 'badge-off'">{{ u.pushToken ? 'Yes' : 'No' }}</span></td>
            <td class="muted">{{ fmtDate(u.createdAt) }}</td>
            <td class="actions">
              <button @click="forceLogout(u.id, u.name)" title="Force logout" class="action-btn">
                <ForceLogout :size="14" />
              </button>
              <button @click="deleteUser(u.id, u.name)" title="Delete user" class="action-btn danger">
                <Trash2 :size="14" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prev" :disabled="offset === 0" class="pg-btn">Previous</button>
      <span class="pg-info">{{ offset + 1 }}–{{ Math.min(offset + limit, total) }} of {{ total }}</span>
      <button @click="next" :disabled="offset + limit >= total" class="pg-btn">Next</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 32px 40px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.page-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.search-wrap {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px 8px 32px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font);
  outline: none;
  width: 260px;
  transition: border-color 0.15s;
}

.search-input:focus {
  border-color: var(--text-muted);
}

.action-toast {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 16px;
  font-size: 13px;
  color: var(--success);
  margin-bottom: 16px;
}

.table-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.loading {
  padding: 32px;
  color: var(--text-muted);
  font-size: 13px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-raised);
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover td {
  background: var(--bg-raised);
}

.user-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-hover);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.muted {
  color: var(--text-muted);
}

.badge-on,
.badge-off {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-on {
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
}

.badge-off {
  background: var(--bg-raised);
  color: var(--text-muted);
}

.actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 5px 7px;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  transition: all 0.15s;
  font-family: var(--font);
}

.action-btn:hover {
  border-color: var(--text-muted);
  color: var(--text-secondary);
}

.action-btn.danger:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}

.pg-btn {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.15s;
}

.pg-btn:hover:not(:disabled) {
  border-color: var(--text-muted);
}

.pg-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pg-info {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
