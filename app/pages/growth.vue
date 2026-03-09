<script setup lang="ts">
import { Bar } from 'vue-chartjs'
// Growth page — connection and user growth metrics
const { request } = useApi()
const range = ref(30)
const stats = ref<any>(null)
const events = ref<any>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  const [s, e] = await Promise.all([
    request<any>('/stats/overview'),
    request<any>(`/analytics/events?days=${range.value}`)
  ])
  stats.value = s.data
  events.value = e.data
  loading.value = false
}
onMounted(load)
watch(range, load)

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#a1a1aa', font: { size: 10 } } },
    y: { border: { display: false }, grid: { color: '#1f1f1f' }, ticks: { color: '#a1a1aa', font: { size: 10 } } }
  }
}

const connData = computed(() => ({
  labels: events.value?.connectionsPerDay.map((r: any) => r.date.slice(5)) || [],
  datasets: [{ data: events.value?.connectionsPerDay.map((r: any) => r.count) || [], backgroundColor: '#ec4899', borderRadius: 4 }]
}))
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Growth</h1>
        <p class="page-sub">Connections and network expansion metrics</p>
      </div>
      <div class="range-tabs">
        <button v-for="d in [7, 30, 90]" :key="d" class="range-tab" :class="{ active: range === d }"
          @click="range = d">{{
            d }}d</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading…</div>
    <template v-else>
      <div class="cards-row" v-if="stats">
        <div class="stat-card">
          <div class="stat-val">{{ stats.totalConnections?.toLocaleString() }}</div>
          <div class="stat-key">Total Connections</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ stats.activeConnections?.toLocaleString() }}</div>
          <div class="stat-key">Active Connections</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ stats.totalUsers?.toLocaleString() }}</div>
          <div class="stat-key">Total Users</div>
        </div>
      </div>

      <div class="chart-card" v-if="events?.connectionsPerDay?.length">
        <div class="chart-header"><span class="chart-title">New Connections per Day</span></div>
        <div class="chart-bars">
          <Bar :data="connData" :options="chartOpts" />
        </div>
      </div>
      <div v-else class="empty-state">No connection data for this period</div>
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

.range-tabs {
  display: flex;
  gap: 4px;
}

.range-tab {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-muted);
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.15s;
}

.range-tab.active {
  background: var(--accent-dim);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.loading {
  color: var(--text-muted);
  font-size: 13px;
  padding: 40px 0;
}

.cards-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  flex: 1;
}

.stat-val {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-key {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.chart-header {
  margin-bottom: 20px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-bars {
  height: 200px;
  position: relative;
}

.empty-state {
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
  padding: 60px 0;
}
</style>
