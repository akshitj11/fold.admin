<script setup lang="ts">
import { Activity, Film, Link2, TrendingUp, Users } from 'lucide-vue-next';

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
          <div v-for="row in signups" :key="row.date" class="bar-col" :title="`${row.date}: ${row.count}`">
            <div class="bar" :style="{ height: barHeight(row.count, signups) + '%' }"></div>
            <span class="bar-label">{{ row.date.slice(5) }}</span>
          </div>
        </div>
        <div v-else class="chart-empty">No data for this period</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
function barHeight(val: number, rows: any[]) {
  const max = Math.max(...rows.map(r => r.count))
  return max === 0 ? 0 : Math.max(4, Math.round((val / max) * 100))
}
</script>

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
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 140px;
  overflow-x: auto;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 20px;
  max-width: 36px;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 100%;
  background: var(--text-muted);
  border-radius: 3px 3px 0 0;
  min-height: 2px;
  transition: background 0.2s;
}

.bar-col:hover .bar {
  background: var(--text-primary);
}

.bar-label {
  font-size: 9px;
  color: var(--text-muted);
  transform: rotate(-45deg);
  white-space: nowrap;
}

.chart-empty {
  color: var(--text-muted);
  font-size: 13px;
  padding: 40px 0;
  text-align: center;
}
</style>
