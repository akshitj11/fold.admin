<script setup lang="ts">
import { Download } from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'

definePageMeta({ layout: 'public' })

const config = useRuntimeConfig()
const error = ref('')
const release = ref<any>(null)
const loading = ref(true)

// URL of this exact download page so desktop users can scan it and open it on their phone
const thisPageUrl = ref('https://admin.fold.taohq.org/download')

onMounted(async () => {
  // In browser, set actual window URL for accurate QR Code
  thisPageUrl.value = window.location.href

  try {
    const res = await fetch(`${config.public.apiUrl}/api/public/apk/latest`)
    const json = await res.json()
    if (json.success) {
      release.value = json.data
    } else {
      error.value = json.error || 'No APK release found.'
    }
  } catch (err) {
    error.value = 'Failed to load the latest release.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="download-container">
    <div class="glass-card">

      <!-- Logo Section -->
      <div class="brand">
        <h1 class="logo">Fold</h1>
        <p class="tagline">Your private memory vault</p>
      </div>

      <div v-if="loading" class="loading">Locating latest version…</div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="release" class="release-info">
        <div class="version-badge">Version {{ release.version }}</div>

        <!-- Action Button -->
        <a :href="release.url" class="download-btn">
          <Download :size="20" />
          <span>Download APK</span>
        </a>

        <!-- Changelog -->
        <div class="changelog" v-if="release.changeLog">
          <h3>What's New</h3>
          <p>{{ release.changeLog }}</p>
        </div>

        <!-- Desktop QR Code -->
        <div class="desktop-only qr-section">
          <p class="qr-text">Or scan with your phone to download</p>
          <div class="qr-code">
            <QrcodeVue :value="thisPageUrl" :size="160" level="H" background="#ffffff" foreground="#0a0a0a" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.download-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg-base);
  background-image: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
}

.glass-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 48px 32px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.brand {
  margin-bottom: 32px;
}

.logo {
  font-size: 42px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -1px;
  margin-bottom: 4px;
}

.tagline {
  font-size: 14px;
  color: var(--text-muted);
}

.loading {
  color: var(--text-muted);
  font-size: 14px;
  padding: 32px 0;
}

.error-state {
  color: var(--danger);
  font-size: 14px;
  padding: 32px 0;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius);
}

.release-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.version-badge {
  display: inline-block;
  background: var(--bg-raised);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid var(--border);
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  background: var(--text-primary);
  color: var(--bg-base);
  padding: 16px;
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s, opacity 0.2s;
}

.download-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.changelog {
  width: 100%;
  text-align: left;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-top: 8px;
}

.changelog h3 {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.changelog p {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: pre-wrap;
  line-height: 1.5;
}

.qr-section {
  margin-top: 16px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  width: 100%;
}

.qr-text {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.qr-code {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  display: inline-block;
}

/* Hide QR code on small screens */
@media (max-width: 640px) {
  .desktop-only {
    display: none;
  }

  .glass-card {
    padding: 32px 24px;
    border: none;
    background: transparent;
    box-shadow: none;
  }

  .download-container {
    background-image: none;
    align-items: flex-start;
    padding-top: 48px;
  }
}
</style>
