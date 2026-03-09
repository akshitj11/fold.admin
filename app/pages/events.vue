<script setup lang="ts">
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

function maxVal(rows: any[]) { return Math.max(...rows.map(r => r.count), 1) }
function barH(val: number, rows: any[]) { return Math.max(4, Math.round((val / maxVal(rows)) * 100)) }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Events</h1>
        <p class="page-sub">Application event analytics</p>
      </div>
      <div class="range-tabs">
        <button v-for="d in [7, 30, 90]" :key="d" class="range-tab" :class="{ active: range === d }" @click="range = d">{{
          d }}d</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading…</div>
    <template v-else-if="events">
      <div class="chart-card">
        <div class="chart-header"><span class="chart-title">Entries Created per Day</span></div>
        <div class="chart-bars">
          <div v-for="row in events.entriesPerDay" :key="row.date" class="bar-col" :title="`${row.date}: ${row.count}`">
            <div class="bar" :style="{ height: barH(row.count, events.entriesPerDay) + '%' }"></div>
            <span class="bar-label">{{ row.date.slice(5) }}</span>
          </div>
        </div>
        <div v-if="!events.entriesPerDay.length" class="chart-empty">No data</div>
      </div>

      <div class="chart-card">
        <div class="chart-header"><span class="chart-title">New Connections per Day</span></div>
        <div class="chart-bars">
          <div v-for="row in events.connectionsPerDay" :key="row.date" class="bar-col"
            :title="`${row.date}: ${row.count}`">
            <div class="bar pink" :style="{ height: barH(row.count, events.connectionsPerDay) + '%' }"></div>
            <span class="bar-label">{{ row.date.slice(5) }}</span>
          </div>
        </div>
        <div v-if="!events.connectionsPerDay.length" class="chart-empty">No data</div>
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
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 140px;
  overflow-x: auto;
}

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
  min-width: 18px;
  max-width: 32px;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 100%;
  background: var(--text-muted);
  border-radius: 3px 3px 0 0;
  transition: background 0.2s;
}

.bar.pink {
  background: #ec4899;
  opacity: 0.7;
}

.bar-col:hover .bar {
  background: var(--text-primary);
}

.bar-col:hover .bar.pink {
  opacity: 1;
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
