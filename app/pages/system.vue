<script setup lang="ts">
import { CheckCircle, XCircle } from 'lucide-vue-next'

const { request } = useApi()
const health = ref<any>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  const { data } = await request<any>('/system/health')
  health.value = data
  loading.value = false
}
onMounted(load)

function fmtUptime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${h}h ${m}m`
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">System</h1>
        <p class="page-sub">Health check and server status</p>
      </div>
      <button class="refresh-btn" @click="load">Refresh</button>
    </div>

    <div v-if="loading" class="loading">Checking system…</div>
    <template v-else-if="health">
      <div class="status-banner" :class="health.status === 'healthy' ? 'green' : 'red'">
        <component :is="health.status === 'healthy' ? CheckCircle : XCircle" :size="20" />
        <span>System is <strong>{{ health.status }}</strong></span>
      </div>

      <div class="cards-row">
        <div class="stat-card">
          <div class="stat-val">{{ health.dbLatencyMs }}ms</div>
          <div class="stat-key">DB Latency</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ fmtUptime(health.uptime) }}</div>
          <div class="stat-key">Uptime</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ health.nodeVersion }}</div>
          <div class="stat-key">Node Version</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ new Date(health.timestamp).toLocaleTimeString() }}</div>
          <div class="stat-key">Last Checked</div>
        </div>
      </div>
    </template>
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

.refresh-btn {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.15s;
}

.refresh-btn:hover {
  border-color: var(--text-muted);
}

.loading {
  color: var(--text-muted);
  font-size: 13px;
  padding: 40px 0;
}

.status-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: var(--radius-lg);
  font-size: 15px;
  margin-bottom: 24px;
}

.status-banner.green {
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: var(--success);
}

.status-banner.red {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--danger);
}

.cards-row {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  flex: 1;
}

.stat-val {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-family: monospace;
}

.stat-key {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
