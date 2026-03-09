<script setup lang="ts">
import { BarChart2, Bell, FileText, Film, HardDrive, LayoutDashboard, LogOut, Scroll, Server, Settings, Shield, TrendingUp, Users, Zap } from 'lucide-vue-next'

const route = useRoute()
const { logout } = useAuth()

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Users', icon: Users, to: '/users' },
  { label: 'Analytics', icon: BarChart2, to: '/analytics' },
  { label: 'Media', icon: Film, to: '/media' },
  { label: 'Notifications', icon: Bell, to: '/notifications' },
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
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <div class="shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-text">Fold</span>
        <span class="logo-badge">Admin</span>
      </div>

      <nav class="nav">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="nav-item"
          :class="{ active: isActive(item.to) }">
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
}
</style>
