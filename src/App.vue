<script setup lang="ts">
import CatalogPage from './features/catalog/CatalogPage.vue'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Product Catalog</h1>
      <p>Vue 3 + TanStack Query Exercise</p>
    </header>
    <main class="app-main">
      <CatalogPage />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.app-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}
</style>
