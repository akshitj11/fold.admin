<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'
const { request } = useApi()
const range = ref(30)
const signups = ref<any[]>([])
const active = ref<any[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  const [s, a] = await Promise.all([
    request<any[]>(`/analytics/signups?days=${range.value}`),
    request<any[]>(`/analytics/active?days=${range.value}`)
  ])
  if (s.data) signups.value = s.data
  if (a.data) active.value = a.data
  loading.value = false
}

onMounted(load)
watch(range, load)

const totalSignups = computed(() => signups.value.reduce((s, r) => s + r.count, 0))
const totalActive = computed(() => active.value.reduce((s, r) => s + r.count, 0))
const avgSignups = computed(() => signups.value.length ? Math.round(totalSignups.value / signups.value.length) : 0)

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#a1a1aa', font: { size: 10 } } },
    y: { border: { display: false }, grid: { color: '#1f1f1f' }, ticks: { color: '#a1a1aa', font: { size: 10 } } }
  }
}

const signupsData = computed(() => ({
  labels: signups.value.map(r => r.date.slice(5)),
  datasets: [{ data: signups.value.map(r => r.count), backgroundColor: '#a1a1aa', borderRadius: 4 }]
}))

const activeData = computed(() => ({
  labels: active.value.map(r => r.date.slice(5)),
  datasets: [{ data: active.value.map(r => r.count), borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.3 }]
}))
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Analytics</h1>
        <p class="page-sub">User growth and activity trends</p>
      </div>
      <div class="range-tabs">
        <button v-for="d in [7, 30, 90]" :key="d" class="range-tab" :class="{ active: range === d }"
          @click="range = d">{{
            d }}d</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading…</div>
    <template v-else>
      <!-- Summary cards -->
      <div class="cards-row">
        <div class="stat-card">
          <div class="stat-val">{{ totalSignups.toLocaleString() }}</div>
          <div class="stat-key">New Signups</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ avgSignups }}</div>
          <div class="stat-key">Avg per Day</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ totalActive.toLocaleString() }}</div>
          <div class="stat-key">Active Sessions</div>
        </div>
      </div>

      <!-- Signup chart -->
      <div class="chart-card">
        <div class="chart-header"><span class="chart-title">Daily Signups</span></div>
        <div class="chart-bars" v-if="signups.length">
          <Bar :data="signupsData" :options="chartOpts" />
        </div>
        <div v-else class="chart-empty">No data</div>
      </div>

      <!-- Active users chart -->
      <div class="chart-card">
        <div class="chart-header"><span class="chart-title">Daily Active Users</span></div>
        <div class="chart-bars" v-if="active.length">
          <Line :data="activeData" :options="chartOpts" />
        </div>
        <div v-else class="chart-empty">No data</div>
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
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 20px;
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

.chart-empty {
  color: var(--text-muted);
  font-size: 13px;
  padding: 40px 0;
  text-align: center;
}
</style>
