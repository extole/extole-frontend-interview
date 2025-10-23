<script setup lang="ts">
import { ref } from 'vue'
import { useProducts } from './useProducts'
// TODO: Import other hooks as you build them

const search = ref('')

const { data: products, isLoading, isError, error, refetch } = useProducts(search)

// TODO: Add handlers for:
// - Toggling favorites
// - Creating products
// - Viewing product details
</script>

<template>
  <div class="catalog-page">
    <div class="catalog-container">
      <!-- Search Section -->
      <div class="search-section">
        <label for="search" class="search-label">Search Products</label>
        <input
          id="search"
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Type to search..."
          autocomplete="off"
        />
      </div>

      <!-- TODO: Add create product form -->

      <!-- Error State -->
      <div v-if="isError && !isLoading" class="error-state">
        <p>{{ error?.message || 'An error occurred' }}</p>
        <button @click="() => refetch()">Retry</button>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading">
        <p>Loading...</p>
        <!-- TODO: Replace with skeleton loaders -->
      </div>

      <!-- Products List -->
      <div v-else-if="products && products.length > 0">
        <div v-for="product in products" :key="product.id">
          <h3>{{ product.name }}</h3>
          <p>${{ product.price }}</p>
          <!-- TODO: Add favorite button -->
          <!-- TODO: Make clickable to show details -->
        </div>
      </div>

      <!-- Empty State -->
      <div v-else>
        <p>No products found</p>
      </div>
    </div>

    <!-- TODO: Add detail panel -->
  </div>
</template>

<style scoped>
.catalog-page {
  display: flex;
  gap: 2rem;
}

.catalog-container {
  flex: 1;
}

.search-section {
  margin-bottom: 2rem;
}

.search-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 1rem;
}

.error-state {
  text-align: center;
  padding: 3rem 1rem;
}

/* TODO: Add more styles as you build the UI */
</style>
