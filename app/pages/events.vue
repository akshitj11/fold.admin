<script setup lang="ts">
import { Bar } from 'vue-chartjs'
const { request } = useApi()
const range = ref(30)
const events = ref<any>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  const { data } = await request<any>(`/analytics/events?days=${range.value}`)
  events.value = data
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

const entriesData = computed(() => ({
  labels: events.value?.entriesPerDay.map((r: any) => r.date.slice(5)) || [],
  datasets: [{ data: events.value?.entriesPerDay.map((r: any) => r.count) || [], backgroundColor: '#a1a1aa', borderRadius: 4 }]
}))

const connData = computed(() => ({
  labels: events.value?.connectionsPerDay.map((r: any) => r.date.slice(5)) || [],
  datasets: [{ data: events.value?.connectionsPerDay.map((r: any) => r.count) || [], backgroundColor: '#ec4899', borderRadius: 4 }]
}))
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Events</h1>
        <p class="page-sub">Application event analytics</p>
      </div>
      <div class="range-tabs">
        <button v-for="d in [7, 30, 90]" :key="d" class="range-tab" :class="{ active: range === d }"
          @click="range = d">{{
            d }}d</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading…</div>
    <template v-else-if="events">
      <div class="chart-card">
        <div class="chart-header"><span class="chart-title">Entries Created per Day</span></div>
        <div class="chart-bars" v-if="events.entriesPerDay?.length">
          <Bar :data="entriesData" :options="chartOpts" />
        </div>
        <div v-else class="chart-empty">No data</div>
      </div>

      <div class="chart-card">
        <div class="chart-header"><span class="chart-title">New Connections per Day</span></div>
        <div class="chart-bars" v-if="events.connectionsPerDay?.length">
          <Bar :data="connData" :options="chartOpts" />
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
