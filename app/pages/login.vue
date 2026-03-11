<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { login } = useAuth()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) return
  loading.value = true
  error.value = ''
  const err = await login(username.value.trim(), password.value.trim())
  loading.value = false
  if (err) { error.value = err; return }
  router.push('/')
}
</script>

<template>
  <div class="login-card">
    <div class="login-header">
      <div class="brand">
        <span class="brand-name">Fold</span>
        <span class="brand-tag">Admin</span>
      </div>
      <p class="hint">Internal dashboard — authorized access only</p>
    </div>

    <form @submit.prevent="handleLogin" class="form">
      <div class="field">
        <label>Username</label>
        <input v-model="username" type="text" placeholder="admin" autocomplete="username" />
      </div>
      <div class="field">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" autocomplete="current-password" />
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button type="submit" class="submit-btn" :disabled="loading">
        <span v-if="loading">Signing in…</span>
        <span v-else>Sign in</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 40px;
  width: 100%;
  max-width: 380px;
}

.login-header {
  margin-bottom: 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.brand-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.brand-tag {
  font-size: 10px;
  font-weight: 600;
  background: var(--bg-raised);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.hint {
  font-size: 13px;
  color: var(--text-muted);
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

.field input {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 14px;
  font-family: var(--font);
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus {
  border-color: var(--text-muted);
}

.field input::placeholder {
  color: var(--text-muted);
}

.error-msg {
  font-size: 13px;
  color: var(--danger);
}

.submit-btn {
  background: var(--text-primary);
  color: var(--bg-base);
  border: none;
  border-radius: var(--radius);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  transition: opacity 0.15s;
  margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
