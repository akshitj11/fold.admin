<script setup lang="ts">
const { request } = useApi()
const flags = ref<any[]>([])
const loading = ref(true)
const newFlag = reactive({ key: '', enabled: false, description: '' })
const msg = ref('')

async function load() {
  loading.value = true
  const { data } = await request<any[]>('/flags')
  if (data) flags.value = data
  loading.value = false
}
onMounted(load)

async function toggle(flag: any) {
  await request('/flags', { method: 'POST', body: JSON.stringify({ key: flag.key, enabled: !flag.enabled, description: flag.description }) })
  load()
}

async function addFlag() {
  if (!newFlag.key) { msg.value = 'Key is required'; return }
  const { error } = await request('/flags', { method: 'POST', body: JSON.stringify({ ...newFlag }) })
  if (error) { msg.value = `Error: ${error}`; return }
  msg.value = 'Flag created'
  newFlag.key = ''; newFlag.description = ''; newFlag.enabled = false
  load()
  setTimeout(() => msg.value = '', 3000)
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Settings</h1>
        <p class="page-sub">Feature flags and platform controls</p>
      </div>
    </div>

    <!-- Add new flag -->
    <div class="section-card">
      <div class="section-title">Add Feature Flag</div>
      <div class="form-row">
        <input v-model="newFlag.key" placeholder="flag_key (snake_case)" class="field-input" />
        <input v-model="newFlag.description" placeholder="Description (optional)" class="field-input" />
        <label class="toggle-label"><input type="checkbox" v-model="newFlag.enabled" /> Enabled</label>
        <button class="add-btn" @click="addFlag">Add</button>
      </div>
      <p v-if="msg" class="form-msg">{{ msg }}</p>
    </div>

    <!-- Feature flags list -->
    <div class="section-card">
      <div class="section-title">Feature Flags</div>
      <div v-if="loading" class="loading">Loading…</div>
      <div v-else class="flag-list">
        <div v-for="flag in flags" :key="flag.id" class="flag-row">
          <div class="flag-info">
            <span class="flag-key">{{ flag.key }}</span>
            <span class="flag-desc">{{ flag.description || '—' }}</span>
          </div>
          <button class="toggle-btn" :class="{ on: flag.enabled }" @click="toggle(flag)">
            <div class="toggle-knob"></div>
          </button>
        </div>
        <div v-if="!flags.length" class="empty">No feature flags defined</div>
      </div>
    </div>

    <!-- Admin info -->
    <div class="section-card">
      <div class="section-title">Admin Session</div>
      <div class="info-row">
        <span class="info-key">Backend API</span>
        <code class="info-val">{{ useRuntimeConfig().public.apiUrl }}</code>
      </div>
      <div class="info-row">
        <span class="info-key">Session Storage</span>
        <span class="info-val">Browser localStorage</span>
      </div>
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

.loading {
  color: var(--text-muted);
  font-size: 13px;
  padding: 16px 0;
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

.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.field-input {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: monospace;
  outline: none;
  flex: 1;
  min-width: 140px;
}

.field-input:focus {
  border-color: var(--text-muted);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
}

.add-btn {
  background: var(--text-primary);
  border: none;
  border-radius: var(--radius);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font);
  color: var(--bg-base);
  cursor: pointer;
  white-space: nowrap;
}

.form-msg {
  font-size: 13px;
  color: var(--success);
  margin-top: 10px;
}

.flag-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-raised);
  border-radius: var(--radius);
}

.flag-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.flag-key {
  font-size: 13px;
  font-weight: 600;
  font-family: monospace;
  color: var(--text-primary);
}

.flag-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.toggle-btn {
  position: relative;
  width: 36px;
  height: 20px;
  background: var(--bg-hover);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.toggle-btn.on {
  background: var(--success);
  border-color: var(--success);
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  transition: transform 0.2s;
}

.toggle-btn.on .toggle-knob {
  transform: translateX(16px);
}

.empty {
  color: var(--text-muted);
  font-size: 13px;
  padding: 16px 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.info-row:last-child {
  border-bottom: none;
}

.info-key {
  font-size: 13px;
  color: var(--text-muted);
}

.info-val {
  font-size: 13px;
  color: var(--text-primary);
}

code.info-val {
  font-family: monospace;
  font-size: 12px;
  background: var(--bg-raised);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
