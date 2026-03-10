<script setup lang="ts">
import { Code, ExternalLink, Link as LinkIcon, Plus, Trash2 } from 'lucide-vue-next'

const { request } = useApi()

const releases = ref<any[]>([])
const loading = ref(true)
const sending = ref(false)
const msg = ref('')

const form = ref({ version: '', url: '', changeLog: '' })
const shareUrl = ref('https://admin.fold.taohq.org/download')

async function load() {
  if (import.meta.client) {
    shareUrl.value = window.location.origin + '/download'
  }
  loading.value = true
  const { data } = await request<any[]>('/apk')
  if (data) releases.value = data
  loading.value = false
}

onMounted(load)

async function createRelease() {
  if (!form.value.version || !form.value.url) return
  sending.value = true

  const { error } = await request('/apk', {
    method: 'POST',
    body: JSON.stringify(form.value)
  })

  sending.value = false
  if (!error) {
    msg.value = 'Release published!'
    form.value = { version: '', url: '', changeLog: '' }
    setTimeout(() => msg.value = '', 3000)
    load()
  }
}

async function deleteRelease(id: string) {
  if (!confirm('Delete this release?')) return
  await request(`/apk/${id}`, { method: 'DELETE' })
  load()
}

function fmtDate(d: string) { return new Date(d).toLocaleString() }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Share APK</h1>
        <p class="page-sub">Publish direct download links for Android users</p>
      </div>
      <a :href="shareUrl" target="_blank" class="share-btn">
        <ExternalLink :size="14" />
        Open Public Share Page
      </a>
    </div>

    <div v-if="msg" class="success-toast">{{ msg }}</div>

    <div class="grid">
      <!-- Compose Form -->
      <div class="compose-card">
        <h2 class="card-title">New Release</h2>

        <form @submit.prevent="createRelease" class="form">
          <div class="field">
            <label>Version Number <span class="req">*</span></label>
            <div class="input-wrap">
              <Code :size="14" class="input-icon" />
              <input v-model="form.version" placeholder="e.g. 1.0.4" required />
            </div>
          </div>

          <div class="field">
            <label>Download URL <span class="req">*</span></label>
            <div class="input-wrap">
              <LinkIcon :size="14" class="input-icon" />
              <input v-model="form.url" type="url" placeholder="https://..." required />
            </div>
            <p class="field-hint">Direct link to the .apk file (S3, R2, etc)</p>
          </div>

          <div class="field">
            <label>Changelog</label>
            <textarea v-model="form.changeLog" rows="4" placeholder="What's new in this version?"></textarea>
          </div>

          <button type="submit" class="btn primary" :disabled="sending || !form.version || !form.url">
            <Plus :size="14" />
            <span v-if="sending">Publishing…</span>
            <span v-else>Publish Release</span>
          </button>
        </form>
      </div>

      <!-- Release History -->
      <div class="history-card">
        <h2 class="card-title">Release History</h2>

        <div v-if="loading" class="empty">Loading…</div>
        <div v-else-if="!releases.length" class="empty">No releases yet.</div>

        <div v-else class="history-list">
          <div v-for="r in releases" :key="r.id" class="history-item">
            <div class="hist-header">
              <div class="hist-title">
                <span class="version-badge">v{{ r.version }}</span>
                <span class="hist-date">{{ fmtDate(r.createdAt) }}</span>
              </div>
              <button @click="deleteRelease(r.id)" class="del-btn" title="Delete Release">
                <Trash2 :size="14" />
              </button>
            </div>
            <a :href="r.url" target="_blank" class="hist-url">{{ r.url }}</a>
            <p v-if="r.changeLog" class="hist-log">{{ r.changeLog }}</p>
          </div>
        </div>
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
  align-items: center;
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

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}

.share-btn:hover {
  background: var(--bg-raised);
}

.success-toast {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid var(--success);
  color: var(--success);
  padding: 12px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.compose-card,
.history-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

.req {
  color: var(--danger);
}

.field-hint {
  font-size: 11px;
  color: var(--text-muted);
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.input-wrap input {
  width: 100%;
  padding-left: 36px !important;
}

input,
textarea {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font);
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: var(--text-muted);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: var(--font);
  transition: opacity 0.15s;
}

.btn:hover:not(:disabled) {
  opacity: 0.85;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.primary {
  background: var(--text-primary);
  color: var(--bg-base);
  margin-top: 8px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-base);
}

.hist-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.hist-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-badge {
  background: var(--bg-raised);
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.hist-date {
  font-size: 11px;
  color: var(--text-muted);
}

.hist-url {
  font-size: 12px;
  color: var(--info);
  text-decoration: none;
  word-break: break-all;
  display: block;
  margin-bottom: 8px;
}

.hist-url:hover {
  text-decoration: underline;
}

.hist-log {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: pre-wrap;
  margin: 0;
  padding: 8px;
  background: var(--bg-raised);
  border-radius: var(--radius);
  border: 1px dashed var(--border);
}

.del-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.del-btn:hover {
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
}

.empty {
  padding: 32px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}
</style>
