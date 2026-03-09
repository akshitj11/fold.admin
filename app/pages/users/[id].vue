<script setup lang="ts">
import { ArrowLeft, LogOut as ForceLogout, Trash2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { request } = useApi()

const data = ref<any>(null)
const loading = ref(true)

async function load() {
  const { data: d } = await request<any>(`/users/${route.params.id}`)
  data.value = d
  loading.value = false
}
onMounted(load)

async function forceLogout() {
  if (!confirm('Force logout this user?')) return
  await request(`/users/${data.value.user.id}/force-logout`, { method: 'POST' })
  alert('User logged out from all sessions.')
}

async function deleteUser() {
  if (!confirm('Permanently delete this user? This cannot be undone.')) return
  await request(`/users/${data.value.user.id}`, { method: 'DELETE' })
  router.push('/users')
}

function fmtDate(d: string) { return new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) }
</script>

<template>
  <div class="page">
    <div class="back-wrap">
      <NuxtLink to="/users" class="back-btn">
        <ArrowLeft :size="14" /> Users
      </NuxtLink>
    </div>

    <div v-if="loading" class="loading">Loading…</div>

    <template v-else-if="data">
      <div class="page-header">
        <div class="user-ident">
          <div class="avatar-lg">{{ data.user.name[0] }}</div>
          <div>
            <h1 class="page-title">{{ data.user.name }}</h1>
            <p class="page-sub">{{ data.user.email }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" @click="forceLogout">
            <ForceLogout :size="14" /> Force Logout
          </button>
          <button class="btn-danger" @click="deleteUser">
            <Trash2 :size="14" /> Delete User
          </button>
        </div>
      </div>

      <!-- Stats row -->
      <div class="stat-row">
        <div class="stat"><span class="stat-val">{{ data.profile?.foldScore ?? 0 }}</span><span class="stat-key">Fold
            Score</span></div>
        <div class="stat"><span class="stat-val">{{ data.profile?.currentStreak ?? 0 }}d</span><span
            class="stat-key">Current Streak</span></div>
        <div class="stat"><span class="stat-val">{{ data.profile?.longestStreak ?? 0 }}d</span><span
            class="stat-key">Best Streak</span></div>
        <div class="stat"><span class="stat-val">{{ data.entryCount }}</span><span class="stat-key">Total Entries</span>
        </div>
        <div class="stat"><span class="stat-val">{{ data.user.emailVerified ? 'Yes' : 'No' }}</span><span
            class="stat-key">Email Verified</span></div>
        <div class="stat"><span class="stat-val">{{ data.user.pushToken ? 'Yes' : 'No' }}</span><span
            class="stat-key">Push Enabled</span></div>
      </div>

      <!-- Info card -->
      <div class="section-card">
        <div class="section-title">Account Details</div>
        <div class="info-grid">
          <div class="info-row"><span class="info-key">User ID</span><code
              class="info-val code">{{ data.user.id }}</code></div>
          <div class="info-row"><span class="info-key">Joined</span><span class="info-val">{{
            fmtDate(data.user.createdAt) }}</span></div>
          <div class="info-row"><span class="info-key">Last Updated</span><span class="info-val">{{
            fmtDate(data.user.updatedAt) }}</span></div>
        </div>
      </div>

      <!-- Recent entries -->
      <div class="section-card">
        <div class="section-title">Recent Entries</div>
        <div v-if="data.recentEntries.length" class="entry-list">
          <div v-for="e in data.recentEntries" :key="e.id" class="entry-row">
            <span class="entry-type">{{ e.type }}</span>
            <span class="entry-caption">{{ e.caption || e.title || e.content?.slice(0, 60) || '—' }}</span>
            <span class="entry-date">{{ fmtDate(e.createdAt) }}</span>
          </div>
        </div>
        <p v-else class="empty-msg">No entries yet</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page {
  padding: 32px 40px;
}

.back-wrap {
  margin-bottom: 20px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s;
}

.back-btn:hover {
  color: var(--text-primary);
}

.loading {
  color: var(--text-muted);
  font-size: 14px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.user-ident {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-lg {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-secondary);
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.page-sub {
  font-size: 13px;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-secondary,
.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.15s;
  border: 1px solid var(--border);
}

.btn-secondary {
  background: var(--bg-raised);
  color: var(--text-secondary);
}

.btn-secondary:hover {
  border-color: var(--text-muted);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.08);
  color: var(--danger);
  border-color: rgba(239, 68, 68, 0.2);
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.16);
}

.stat-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.stat-val {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
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
  margin-bottom: 16px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-key {
  font-size: 13px;
  color: var(--text-muted);
}

.info-val {
  font-size: 13px;
  color: var(--text-primary);
}

code.code {
  font-family: monospace;
  font-size: 12px;
  background: var(--bg-raised);
  padding: 2px 6px;
  border-radius: 4px;
}

.entry-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.entry-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-raised);
  border-radius: var(--radius);
}

.entry-type {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bg-hover);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.entry-caption {
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-date {
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.empty-msg {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
