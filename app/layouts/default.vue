<script setup lang="ts">
import { BarChart2, Bell, FileText, Film, HardDrive, LayoutDashboard, LogOut, Menu, Scroll, Server, Settings, Shield, Smartphone, TrendingUp, Users, X, Zap } from 'lucide-vue-next'

const route = useRoute()
const { logout } = useAuth()

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Users', icon: Users, to: '/users' },
  { label: 'Analytics', icon: BarChart2, to: '/analytics' },
  { label: 'Media', icon: Film, to: '/media' },
  { label: 'Notifications', icon: Bell, to: '/notifications' },
  { label: 'Share APK', icon: Smartphone, to: '/apk' },
  { label: 'CMS', icon: FileText, to: '/cms' },
  { label: 'Growth', icon: TrendingUp, to: '/growth' },
  { label: 'Events', icon: Zap, to: '/events' },
  { label: 'System', icon: Server, to: '/system' },
  { label: 'Storage', icon: HardDrive, to: '/storage' },
  { label: 'Moderation', icon: Shield, to: '/moderation' },
  { label: 'Logs', icon: Scroll, to: '/logs' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

function isActive(to: string) {
}

const menuOpen = ref(false)
function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }

// Close menu on route change
watch(route, closeMenu, { deep: true })
</script>

<template>
  <div class="shell" :class="{ 'menu-open': menuOpen }">
    <!-- Mobile overlay -->
    <div class="sidebar-overlay" @click="closeMenu"></div>

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-text">Fold</span>
        <span class="logo-badge">Admin</span>
        <button class="mobile-close" @click="closeMenu">
          <X :size="20" />
        </button>
      </div>

      <nav class="nav">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="nav-item"
          :class="{ active: isActive(item.to) }" @click="closeMenu">
          <component :is="item.icon" :size="16" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <button class="logout-btn" @click="logout">
        <LogOut :size="16" />
        <span>Logout</span>
      </button>
    </aside>

    <!-- Main content -->
    <main class="main">
      <div class="mobile-header">
        <button class="menu-btn" @click="toggleMenu">
          <Menu :size="20" />
        </button>
        <span class="mobile-title">Fold Admin</span>
      </div>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg-base);
}

/* Sidebar */
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 0;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.logo-badge {
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

.nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius);
  color: var(--text-muted);
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s;
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.nav-item.active {
  background: var(--accent-dim);
  color: var(--text-primary);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  background: none;
  border-left: none;
  border-right: none;
  border-bottom: none;
  color: var(--text-muted);
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s;
  width: 100%;
  text-align: left;
}

.logout-btn:hover {
  color: var(--danger);
}

/* Main */
.main {
  flex: 1;
  margin-left: 220px;
  min-height: 100vh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.mobile-header {
  display: none;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 5;
}

.menu-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
}

.mobile-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 16px;
}

.mobile-close {
  display: none;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  margin-left: auto;
  padding: 4px;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 9;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

@media (max-width: 768px) {
  .main {
    margin-left: 0;
  }

  .mobile-header {
    display: flex;
  }

  .mobile-close {
    display: block;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
  }

  .menu-open .sidebar {
    transform: translateX(0);
  }

  .menu-open .sidebar-overlay {
    display: block;
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
