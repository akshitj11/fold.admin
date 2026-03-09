<script setup lang="ts">
import { Send } from 'lucide-vue-next'

const { request } = useApi()
const history = ref<any[]>([])
const loading = ref(true)
const sending = ref(false)
const msg = ref('')

const form = reactive({ title: '', body: '', audience: 'all' })

async function load() {
  loading.value = true
  const { data } = await request<any[]>('/notifications/history')
  if (data) history.value = data
  loading.value = false
}
onMounted(load)

async function send() {
  if (!form.title || !form.body) { msg.value = 'Title and message are required'; return }
  sending.value = true
  msg.value = ''
  const { data, error } = await request<any>('/notifications/broadcast', {
    method: 'POST',
    body: JSON.stringify({ title: form.title, body: form.body, audience: form.audience })
  })
  sending.value = false
  if (error) { msg.value = `Error: ${error}`; return }
  msg.value = `Sent to ${data.sent} device(s)`
  form.title = ''; form.body = ''
  load()
}

function fmtDate(d: string) { return new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Notifications</h1>
        <p class="page-sub">Send push notifications to users</p>
      </div>
    </div>

    <!-- Send form -->
    <div class="section-card">
      <div class="section-title">Send Broadcast</div>
      <div class="form">
        <div class="field-row">
          <div class="field">
            <label>Title</label>
            <input v-model="form.title" placeholder="Notification title" />
          </div>
          <div class="field">
            <label>Audience</label>
            <select v-model="form.audience">
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="ios">iOS Only</option>
              <option value="android">Android Only</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>Message</label>
          <textarea v-model="form.body" placeholder="Notification body text…" rows="3"></textarea>
        </div>
        <div class="form-footer">
          <p v-if="msg" class="form-msg" :class="{ error: msg.startsWith('Error') }">{{ msg }}</p>
          <button class="send-btn" @click="send" :disabled="sending">
            <Send :size="14" />
            {{ sending ? 'Sending…' : 'Send Push Notification' }}
          </button>
        </div>
      </div>
    </div>

    <!-- History -->
    <div class="section-card">
      <div class="section-title">Notification History</div>
      <div v-if="loading" class="loading">Loading…</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Audience</th>
            <th>Sent</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in history" :key="n.id">
            <td class="bold">{{ n.title }}</td>
            <td class="muted">{{ n.audience }}</td>
            <td>{{ n.sentCount.toLocaleString() }}</td>
            <td class="muted">{{ fmtDate(n.createdAt) }}</td>
          </tr>
          <tr v-if="!history.length">
            <td colspan="4" class="empty">No notifications sent yet</td>
          </tr>
        </tbody>
      </table>
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
  padding: 24px 0;
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

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field-row {
  display: flex;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.field label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

.field input,
.field select,
.field textarea {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 9px 12px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font);
  outline: none;
  transition: border-color 0.15s;
  resize: vertical;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: var(--text-muted);
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.form-msg {
  font-size: 13px;
  color: var(--success);
}

.form-msg.error {
  color: var(--danger);
}

.send-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--text-primary);
  color: var(--bg-base);
  border: none;
  border-radius: var(--radius);
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  transition: opacity 0.15s;
}

.send-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  padding: 9px 12px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-raised);
}

.table td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.table tr:last-child td {
  border-bottom: none;
}

.bold {
  font-weight: 500;
  color: var(--text-primary);
}

.muted {
  color: var(--text-muted);
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 24px 0;
}
</style>
