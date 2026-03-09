<script setup lang="ts">
import { Activity, Film, Link2, TrendingUp, Users } from 'lucide-vue-next';
import { Bar } from 'vue-chartjs';

const { request } = useApi()

const stats = ref<any>(null)
const signups = ref<any[]>([])
const loading = ref(true)
const range = ref(30)

async function load() {
  loading.value = true
  const [overviewRes, signupsRes] = await Promise.all([
    request<any>('/stats/overview'),
    request<any[]>(`/analytics/signups?days=${range.value}`)
  ])
  if (overviewRes.data) stats.value = overviewRes.data
  if (signupsRes.data) signups.value = signupsRes.data
  loading.value = false
}

onMounted(load)
watch(range, load)

const cards = computed(() => {
  if (!stats.value) return []
  return [
    { label: 'Total Users', value: fmt(stats.value.totalUsers), icon: Users, color: '#a1a1aa' },
    { label: 'New Today', value: fmt(stats.value.newUsersToday), icon: TrendingUp, color: '#22c55e' },
    { label: 'Active Today', value: fmt(stats.value.activeUsersToday), icon: Activity, color: '#3b82f6' },
    { label: 'New This Week', value: fmt(stats.value.newUsersWeek), icon: Users, color: '#f59e0b' },
    { label: 'New This Month', value: fmt(stats.value.newUsersMonth), icon: Users, color: '#a1a1aa' },
    { label: 'Media Uploads', value: fmt(stats.value.totalMediaUploaded), icon: Film, color: '#8b5cf6' },
    { label: 'Total Entries', value: fmt(stats.value.totalEntries), icon: Film, color: '#a1a1aa' },
    { label: 'Active Connections', value: fmt(stats.value.activeConnections), icon: Link2, color: '#ec4899' },
  ]
})

function fmt(n: number) {
  if (!n && n !== 0) return '—'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

const chartData = computed(() => ({
  labels: signups.value.map(r => r.date.slice(5)),
  datasets: [{
    label: 'Signups',
    data: signups.value.map(r => r.count),
    backgroundColor: '#3b82f6',
    borderRadius: 4
  }]
}))

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#a1a1aa', font: { size: 10 } } },
    y: { border: { display: false }, grid: { color: '#1f1f1f' }, ticks: { color: '#a1a1aa', font: { size: 10 } } }
  }
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">Platform health and growth overview</p>
      </div>
      <div class="range-tabs">
        <button v-for="d in [7, 30, 90]" :key="d" class="range-tab" :class="{ active: range === d }" @click="range = d">
          {{ d }}d
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading…</div>

    <template v-else>
      <!-- Metric cards -->
      <div class="cards-grid">
        <div v-for="c in cards" :key="c.label" class="metric-card">
          <div class="metric-icon" :style="{ color: c.color }">
            <component :is="c.icon" :size="18" />
          </div>
          <div class="metric-value">{{ c.value }}</div>
          <div class="metric-label">{{ c.label }}</div>
        </div>
      </div>

      <!-- Signup chart -->
      <div class="chart-card">
        <div class="chart-header">
          <span class="chart-title">New Signups</span>
          <span class="chart-sub">Last {{ range }} days</span>
        </div>
        <div class="chart-bars" v-if="signups.length">
          <Bar :data="chartData" :options="chartOpts" />
        </div>
        <div v-else class="chart-empty">No data for this period</div>
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
  margin-bottom: 32px;
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
  transition: all 0.15s;
  font-family: var(--font);
}

.range-tab:hover {
  color: var(--text-secondary);
}

.range-tab.active {
  background: var(--accent-dim);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.loading {
  color: var(--text-muted);
  font-size: 14px;
  padding: 40px 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: border-color 0.15s;
}

.metric-card:hover {
  border-color: var(--text-muted);
}

.metric-icon {
  margin-bottom: 16px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 6px;
}

.metric-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.chart-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.chart-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.chart-bars {
  height: 200px;
  position: relative;
}

.chart-empty {
  color: var(--text-muted);
  font-size: 13px;
  padding: 40px 0;
  text-align: center;
}
</style>
