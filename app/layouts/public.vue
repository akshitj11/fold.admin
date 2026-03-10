<template>
  <div class="public-layout">
    <slot />
  </div>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  background: var(--bg-base);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}
</style>
