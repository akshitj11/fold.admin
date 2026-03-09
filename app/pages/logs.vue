<script setup lang="ts">
const { request } = useApi()
const logs = ref<any[]>([])
const total = ref(0)
const loading = ref(true)
const offset = ref(0)
const limit = 100

async function load() {
  loading.value = true
  const { data } = await request<any>(`/logs?limit=${limit}&offset=${offset.value}`)
  if (data) { logs.value = data.logs; total.value = data.total }
  loading.value = false
}
onMounted(load)

function fmtDate(d: string) { return new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) }
const actionColors: Record<string, string> = {
  user_deleted: '#ef4444', user_force_logout: '#f59e0b',
  notification_sent: '#3b82f6', cms_created: '#22c55e',
  cms_updated: '#22c55e', cms_deleted: '#ef4444',
  flag_toggled: '#8b5cf6'
}

async function exportLogs(fmt: string) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('admin_token')
  window.open(`${config.public.apiUrl}/api/admin/export/logs?format=${fmt}&token=${token}`)
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Admin Logs</h1>
        <p class="page-sub">{{ total.toLocaleString() }} log entries</p>
      </div>
      <div class="actions-row">
        <button class="export-btn" @click="exportLogs('csv')">Export CSV</button>
        <button class="export-btn" @click="exportLogs('json')">Export JSON</button>
      </div>
    </div>

    <div class="table-card">
      <div v-if="loading" class="loading">Loading logs…</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Entity</th>
            <th>Entity ID</th>
            <th>IP</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td><span class="action-tag" :style="{ color: actionColors[log.action] || 'var(--text-secondary)' }">{{
                log.action }}</span></td>
            <td class="muted">{{ log.entity ?? '—' }}</td>
            <td class="code">{{ log.entityId ? log.entityId.slice(0, 12) + '…' : '—' }}</td>
            <td class="code muted">{{ log.ipAddress ?? '—' }}</td>
            <td class="muted">{{ fmtDate(log.createdAt) }}</td>
          </tr>
          <tr v-if="!logs.length">
            <td colspan="5" class="empty">No logs yet</td>
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

.actions-row {
  display: flex;
  gap: 8px;
}

.export-btn {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.15s;
}

.export-btn:hover {
  border-color: var(--text-muted);
}

.loading {
  padding: 32px;
  color: var(--text-muted);
  font-size: 13px;
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
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover td {
  background: var(--bg-hover);
}

.action-tag {
  font-size: 12px;
  font-weight: 600;
  font-family: monospace;
}

.muted {
  color: var(--text-muted);
}

.code {
  font-family: monospace;
  font-size: 12px;
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 32px;
}
</style>
