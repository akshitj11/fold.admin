<script setup lang="ts">
// Moderation — user list focused on moderation actions
const { request } = useApi()
const users = ref<any[]>([])
const loading = ref(true)
const msg = ref('')

async function load() {
  loading.value = true
  const { data } = await request<any>('/users?limit=100')
  if (data) users.value = data.users
  loading.value = false
}
onMounted(load)

async function forceLogout(id: string, name: string) {
  if (!confirm(`Force logout ${name}?`)) return
  await request(`/users/${id}/force-logout`, { method: 'POST' })
  msg.value = `Logged out ${name}`
  setTimeout(() => msg.value = '', 3000)
}

async function deleteUser(id: string, name: string) {
  if (!confirm(`Permanently DELETE ${name}? This cannot be undone.`)) return
  await request(`/users/${id}`, { method: 'DELETE' })
  users.value = users.value.filter(u => u.id !== id)
  msg.value = `Deleted ${name}`
  setTimeout(() => msg.value = '', 3000)
}

function fmtDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Moderation</h1>
        <p class="page-sub">User moderation and account actions</p>
      </div>
    </div>

    <div v-if="msg" class="toast">{{ msg }}</div>

    <div class="table-card">
      <div v-if="loading" class="loading">Loading users…</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Score</th>
            <th>Joined</th>
            <th>Actions</th>
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
            <td class="muted">{{ fmtDate(u.createdAt) }}</td>
            <td class="actions">
              <button @click="forceLogout(u.id, u.name)" class="mod-btn warn" title="Force Logout">Force Logout</button>
              <button @click="deleteUser(u.id, u.name)" class="mod-btn danger" title="Delete">Delete</button>
            </td>
          </tr>
          <tr v-if="!users.length">
            <td colspan="5" class="empty">No users found</td>
          </tr>
        </tbody>
      </table>
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

.loading {
  padding: 32px;
  color: var(--text-muted);
  font-size: 13px;
}

.toast {
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

.actions {
  display: flex;
  gap: 6px;
}

.mod-btn {
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font);
  border: 1px solid;
  border-radius: var(--radius);
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.15s;
  background: none;
}

.mod-btn.warn {
  color: var(--warning);
  border-color: rgba(245, 158, 11, 0.2);
}

.mod-btn.warn:hover {
  background: rgba(245, 158, 11, 0.08);
}

.mod-btn.danger {
  color: var(--danger);
  border-color: rgba(239, 68, 68, 0.2);
}

.mod-btn.danger:hover {
  background: rgba(239, 68, 68, 0.08);
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 32px;
}
</style>
