<script setup lang="ts">
const { request } = useApi()
const range = ref(30)
const media = ref<any>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  const { data } = await request<any>(`/analytics/media?days=${range.value}`)
  media.value = data
  loading.value = false
}
onMounted(load)
watch(range, load)

const typeColors: Record<string, string> = { image: '#3b82f6', video: '#8b5cf6', audio: '#22c55e', text: '#f59e0b' }
function maxVal(rows: any[]) { return Math.max(...rows.map(r => r.count), 1) }
function barH(val: number, rows: any[]) { return Math.max(4, Math.round((val / maxVal(rows)) * 100)) }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Media Analytics</h1>
        <p class="page-sub">Uploads and content breakdown</p>
      </div>
      <div class="range-tabs">
        <button v-for="d in [7, 30, 90]" :key="d" class="range-tab" :class="{ active: range === d }" @click="range = d">{{
          d }}d</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading…</div>
    <template v-else-if="media">
      <!-- Media type donut-like list -->
      <div class="section-card">
        <div class="section-title">Media Type Breakdown</div>
        <div class="type-list">
          <div v-for="t in media.byType" :key="t.type" class="type-row">
            <div class="type-dot" :style="{ background: typeColors[t.type] || '#a1a1aa' }"></div>
            <span class="type-name">{{ t.type }}</span>
            <div class="type-bar-wrap">
              <div class="type-bar"
                :style="{ width: Math.max(4, Math.round(t.count / (Math.max(...media.byType.map((x: any) => x.count), 1)) * 100)) + '%', background: typeColors[t.type] || '#a1a1aa' }">
              </div>
            </div>
            <span class="type-count">{{ t.count.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Entry types -->
      <div class="section-card">
        <div class="section-title">Entry Types</div>
        <div class="type-list">
          <div v-for="t in media.entryTypes" :key="t.type" class="type-row">
            <div class="type-dot" :style="{ background: typeColors[t.type] || '#a1a1aa' }"></div>
            <span class="type-name">{{ t.type }}</span>
            <div class="type-bar-wrap">
              <div class="type-bar"
                :style="{ width: Math.max(4, Math.round(t.count / (Math.max(...media.entryTypes.map((x: any) => x.count), 1)) * 100)) + '%', background: typeColors[t.type] || '#a1a1aa' }">
              </div>
            </div>
            <span class="type-count">{{ t.count.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Uploads per day chart -->
      <div class="chart-card">
        <div class="chart-header"><span class="chart-title">Entries per Day</span></div>
        <div class="chart-bars">
          <div v-for="row in media.perDay" :key="row.date" class="bar-col" :title="`${row.date}: ${row.count}`">
            <div class="bar" :style="{ height: barH(row.count, media.perDay) + '%' }"></div>
            <span class="bar-label">{{ row.date.slice(5) }}</span>
          </div>
        </div>
        <div v-if="!media.perDay.length" class="chart-empty">No data</div>
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

.section-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.type-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.type-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.type-name {
  font-size: 13px;
  color: var(--text-secondary);
  min-width: 60px;
  text-transform: capitalize;
}

.type-bar-wrap {
  flex: 1;
  background: var(--bg-raised);
  border-radius: 3px;
  height: 6px;
  overflow: hidden;
}

.type-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s;
  opacity: 0.8;
}

.type-count {
  font-size: 13px;
  color: var(--text-muted);
  min-width: 40px;
  text-align: right;
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
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 120px;
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
  padding: 32px 0;
  text-align: center;
}
</style>
