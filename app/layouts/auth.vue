<script setup lang="ts">
// Auth layout (no sidebar) — for login page
</script>

<template>
  <div class="auth-wrap">
    <slot />
  </div>
</template>

<style scoped>
.auth-wrap {
  min-height: 100vh;
  background: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
