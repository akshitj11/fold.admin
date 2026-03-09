<script setup lang="ts">
// Storage page — re-uses media analytics data as a proxy for storage breakdown
const { request } = useApi()
const range = ref(30)
const media = ref<any>(null)
const overview = ref<any>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  const [m, s] = await Promise.all([
    request<any>(`/analytics/media?days=${range.value}`),
    request<any>('/stats/overview')
  ])
  media.value = m.data
  overview.value = s.data
  loading.value = false
}
onMounted(load)
watch(range, load)

const typeColors: Record<string, string> = { image: '#3b82f6', video: '#8b5cf6', audio: '#22c55e', text: '#f59e0b' }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Storage</h1>
        <p class="page-sub">Media storage breakdown and usage</p>
      </div>
      <div class="range-tabs">
        <button v-for="d in [7, 30, 90]" :key="d" class="range-tab" :class="{ active: range === d }" @click="range = d">{{
          d }}d</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading…</div>
    <template v-else>
      <div class="cards-row" v-if="overview">
        <div class="stat-card">
          <div class="stat-val">{{ overview.totalMediaUploaded?.toLocaleString() }}</div>
          <div class="stat-key">Total Media Files</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ overview.totalEntries?.toLocaleString() }}</div>
          <div class="stat-key">Total Entries</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">S3</div>
          <div class="stat-key">Storage Provider</div>
        </div>
      </div>

      <div class="section-card" v-if="media?.byType">
        <div class="section-title">Storage by Media Type</div>
        <div class="type-list">
          <div v-for="t in media.byType" :key="t.type" class="type-row">
            <div class="type-dot" :style="{ background: typeColors[t.type] || '#a1a1aa' }"></div>
            <span class="type-name">{{ t.type }}</span>
            <div class="type-bar-wrap">
              <div class="type-bar"
                :style="{ width: Math.max(4, Math.round(t.count / (Math.max(...media.byType.map((x: any) => x.count), 1)) * 100)) + '%', background: typeColors[t.type] || '#a1a1aa' }">
              </div>
            </div>
            <span class="type-count">{{ t.count.toLocaleString() }} files</span>
          </div>
        </div>
        <p class="note">Note: Actual byte size requires S3 inventory reports. File counts shown above.</p>
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

.section-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
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
  gap: 12px;
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
  min-width: 80px;
  text-align: right;
}

.note {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 16px;
  border-top: 1px solid var(--border);
  padding-top: 12px;
}
</style>
