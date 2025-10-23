<script setup lang="ts">
// TODO: Import necessary hooks and types
// import { ref } from 'vue'
// import { useProducts } from './useProducts'
// import type { Product } from './api'

</script>

<template>
  <div class="catalog-page">
    <h1>Product Catalog</h1>
    <p>TODO: Build the catalog interface here!</p>
    
    <div class="api-test">
      <h2>Test the API</h2>
      <p>The backend is running! Try this curl command to see products:</p>
      <pre><code>curl http://localhost:3001/api/products</code></pre>
    </div>
    
    <!-- TODO: Add search input -->
    <!-- TODO: Add product list -->
    <!-- TODO: Add loading and error states -->
  </div>
</template>

<style scoped>
.catalog-page {
  padding: 2rem;
}

.api-test {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.api-test h2 {
  margin-top: 0;
  font-size: 1.25rem;
}

.api-test p {
  margin-bottom: 1rem;
  color: #666;
}

.api-test pre {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
}

.api-test code {
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 0.9rem;
}
</style>
