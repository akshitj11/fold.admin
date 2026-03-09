<script setup lang="ts">
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-vue-next'

const { request } = useApi()
const entries = ref<any[]>([])
const loading = ref(true)
const showForm = ref(false)
const editId = ref<string | null>(null)
const msg = ref('')

const form = reactive({ slug: '', type: 'announcement', title: '', content: '', isActive: true })
const types = ['announcement', 'banner', 'faq', 'help', 'terms', 'privacy']

async function load() {
  loading.value = true
  const { data } = await request<any[]>('/cms')
  if (data) entries.value = data
  loading.value = false
}
onMounted(load)

function startCreate() { editId.value = null; Object.assign(form, { slug: '', type: 'announcement', title: '', content: '', isActive: true }); showForm.value = true }
function startEdit(e: any) { editId.value = e.id; Object.assign(form, { slug: e.slug, type: e.type, title: e.title, content: e.content, isActive: e.isActive }); showForm.value = true }

async function save() {
  const method = editId.value ? 'PATCH' : 'POST'
  const path = editId.value ? `/cms/${editId.value}` : '/cms'
  const { error } = await request(path, { method, body: JSON.stringify({ ...form }) })
  if (error) { msg.value = `Error: ${error}`; return }
  msg.value = editId.value ? 'Updated' : 'Created'
  showForm.value = false; load()
  setTimeout(() => msg.value = '', 3000)
}

async function toggle(e: any) {
  await request(`/cms/${e.id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !e.isActive }) })
  load()
}

async function remove(id: string) {
  if (!confirm('Delete this CMS entry?')) return
  await request(`/cms/${id}`, { method: 'DELETE' })
  entries.value = entries.value.filter(e => e.id !== id)
}

function fmtDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">CMS</h1>
        <p class="page-sub">Manage in-app content without redeploying</p>
      </div>
      <button class="create-btn" @click="startCreate">
        <Plus :size="14" /> New Entry
      </button>
    </div>

    <div v-if="msg" class="toast">{{ msg }}</div>

    <!-- Create/Edit form -->
    <div v-if="showForm" class="section-card form-card">
      <div class="section-title">{{ editId ? 'Edit Entry' : 'New CMS Entry' }}</div>
      <div class="form">
        <div class="field-row">
          <div class="field">
            <label>Slug</label>
            <input v-model="form.slug" placeholder="unique-slug" />
          </div>
          <div class="field">
            <label>Type</label>
            <select v-model="form.type">
              <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>Title</label>
          <input v-model="form.title" placeholder="Entry title" />
        </div>
        <div class="field">
          <label>Content</label>
          <RichEditor v-model="form.content" placeholder="Write your content here…" />
        </div>
        <div class="form-footer">
          <label class="toggle-label">
            <input type="checkbox" v-model="form.isActive" />
            Active
          </label>
          <div class="form-btns">
            <button class="cancel-btn" @click="showForm = false">Cancel</button>
            <button class="save-btn" @click="save">{{ editId ? 'Save Changes' : 'Create' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- CMS entries table -->
    <div class="section-card">
      <div v-if="loading" class="loading">Loading…</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Slug</th>
            <th>Type</th>
            <th>Title</th>
            <th>Status</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in entries" :key="e.id">
            <td class="code">{{ e.slug }}</td>
            <td><span class="badge">{{ e.type }}</span></td>
            <td class="bold">{{ e.title }}</td>
            <td><span :class="e.isActive ? 'badge-on' : 'badge-off'">{{ e.isActive ? 'Active' : 'Inactive' }}</span>
            </td>
            <td class="muted">{{ fmtDate(e.updatedAt) }}</td>
            <td class="actions">
              <button @click="toggle(e)" class="action-btn" :title="e.isActive ? 'Deactivate' : 'Activate'">
                <component :is="e.isActive ? EyeOff : Eye" :size="14" />
              </button>
              <button @click="startEdit(e)" class="action-btn">
                <Pencil :size="14" />
              </button>
              <button @click="remove(e.id)" class="action-btn danger">
                <Trash2 :size="14" />
              </button>
            </td>
          </tr>
          <tr v-if="!entries.length">
            <td colspan="6" class="empty">No CMS entries yet</td>
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

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--text-primary);
  color: var(--bg-base);
  border: none;
  border-radius: var(--radius);
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  transition: opacity 0.15s;
}

.create-btn:hover {
  opacity: 0.85;
}

.toast {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 16px;
  font-size: 13px;
  color: var(--success);
  margin-bottom: 16px;
}

.loading {
  padding: 24px;
  color: var(--text-muted);
  font-size: 13px;
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
.field select {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 9px 12px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: monospace;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus,
.field select:focus {
  border-color: var(--text-muted);
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
}

.form-btns {
  display: flex;
  gap: 8px;
}

.cancel-btn {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 16px;
  font-size: 13px;
  font-family: var(--font);
  color: var(--text-secondary);
  cursor: pointer;
}

.save-btn {
  background: var(--text-primary);
  border: none;
  border-radius: var(--radius);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font);
  color: var(--bg-base);
  cursor: pointer;
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

.table tr:hover td {
  background: var(--bg-raised);
}

.code {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

.bold {
  font-weight: 500;
  color: var(--text-primary);
}

.muted {
  color: var(--text-muted);
}

.badge {
  font-size: 11px;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 8px;
  color: var(--text-secondary);
}

.badge-on {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
}

.badge-off {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bg-raised);
  color: var(--text-muted);
}

.actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 5px 7px;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  transition: all 0.15s;
}

.action-btn:hover {
  border-color: var(--text-muted);
  color: var(--text-secondary);
}

.action-btn.danger:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 24px 0;
}
</style>
