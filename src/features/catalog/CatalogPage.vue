<script setup lang="ts">
import { ref } from 'vue'
import { useProducts } from './useProducts'
import { useProduct } from './useProduct'
import { useToggleFavorite } from './useToggleFavorite'
import { useCreateProduct } from './useCreateProduct'
import type { Product } from './api'

const search = ref('')
const selectedId = ref<string | null>(null)

// Create Product Form State
const showCreateForm = ref(false)
const newProductName = ref('')
const newProductPrice = ref('')

// Track which product is being favorited
const togglingFavoriteId = ref<string | null>(null)

const { data: products, isLoading, isError, error, refetch } = useProducts(search)
const { data: selectedProduct } = useProduct(selectedId, search)
const toggleFavoriteMutation = useToggleFavorite(search)
const createProductMutation = useCreateProduct(search)

const handleToggleFavorite = (productId: string) => {
  togglingFavoriteId.value = productId
  toggleFavoriteMutation.mutate(productId, {
    onSettled: () => {
      togglingFavoriteId.value = null
    },
  })
}

const handleSelectProduct = (product: Product) => {
  selectedId.value = product.id
}

const handleCloseDetail = () => {
  selectedId.value = null
}

const handleCreateProduct = () => {
  const price = parseFloat(newProductPrice.value)
  
  if (!newProductName.value.trim() || isNaN(price) || price <= 0) {
    return
  }

  createProductMutation.mutate(
    { name: newProductName.value.trim(), price },
    {
      onSuccess: () => {
        // Reset form
        newProductName.value = ''
        newProductPrice.value = ''
        showCreateForm.value = false
      },
    }
  )
}

const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value
  if (!showCreateForm.value) {
    // Reset form when closing
    newProductName.value = ''
    newProductPrice.value = ''
  }
  // Reset mutation state
  createProductMutation.reset()
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
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

      <!-- Create Product Section -->
      <div class="create-section">
        <button
          class="toggle-form-button"
          @click="toggleCreateForm"
        >
          <svg
            class="button-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="!showCreateForm"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {{ showCreateForm ? 'Cancel' : 'Add New Product' }}
        </button>

        <div v-if="showCreateForm" class="create-form">
          <h3 class="form-title">Create New Product</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="product-name" class="form-label">Product Name</label>
              <input
                id="product-name"
                v-model="newProductName"
                type="text"
                class="form-input"
                placeholder="e.g. Carbon Fiber Panel"
                required
              />
            </div>
            <div class="form-group">
              <label for="product-price" class="form-label">Price ($)</label>
              <input
                id="product-price"
                v-model="newProductPrice"
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div class="form-actions">
            <button
              class="submit-button"
              :disabled="createProductMutation.isPending.value || !newProductName.trim() || !newProductPrice"
              @click="handleCreateProduct"
            >
              <span v-if="createProductMutation.isPending.value">Creating...</span>
              <span v-else>Create Product</span>
            </button>
          </div>

          <div v-if="createProductMutation.isError.value" class="form-error">
            {{ createProductMutation.error.value?.message || 'Failed to create product' }}
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="isError && !isLoading" class="error-state">
        <svg
          class="error-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="error-title">Failed to load products</h3>
        <p class="error-message">{{ error?.message || 'An error occurred' }}</p>
        <button class="retry-button" @click="() => refetch()">
          Retry
        </button>
      </div>

      <!-- Loading Skeletons -->
      <div v-else-if="isLoading" class="products-list">
        <div v-for="i in 5" :key="i" class="product-card skeleton-card">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-price"></div>
          <div class="skeleton skeleton-button"></div>
        </div>
      </div>

      <!-- Products List -->
      <div v-else-if="products && products.length > 0" class="products-list">
        <article
          v-for="product in products"
          :key="product.id"
          class="product-card"
          :class="{ 'product-card--selected': selectedId === product.id }"
          tabindex="0"
          role="button"
          @click="handleSelectProduct(product)"
          @keydown.enter="handleSelectProduct(product)"
          @keydown.space.prevent="handleSelectProduct(product)"
        >
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ formatPrice(product.price) }}</p>
          </div>
          <button
            class="favorite-button"
            :class="{ 'favorite-button--active': product.favorite }"
            :aria-pressed="product.favorite"
            :disabled="togglingFavoriteId === product.id"
            @click.stop="handleToggleFavorite(product.id)"
          >
            <svg
              class="favorite-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="product.favorite"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
              <path
                v-else
                d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
              />
            </svg>
            <span class="sr-only">
              {{ product.favorite ? 'Unfavorite' : 'Favorite' }}
            </span>
          </button>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <svg
          class="empty-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 class="empty-title">No products found</h3>
        <p class="empty-message">Try adjusting your search terms</p>
      </div>
    </div>

    <!-- Detail Panel -->
    <aside
      v-if="selectedId && selectedProduct"
      class="detail-panel"
      role="dialog"
      aria-label="Product details"
    >
      <div class="detail-header">
        <h2 class="detail-title">Product Details</h2>
        <button
          class="close-button"
          aria-label="Close details"
          @click="handleCloseDetail"
        >
          <svg
            class="close-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="detail-content">
        <div class="detail-row">
          <span class="detail-label">ID</span>
          <span class="detail-value">{{ selectedProduct.id }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Name</span>
          <span class="detail-value">{{ selectedProduct.name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Price</span>
          <span class="detail-value">{{
            formatPrice(selectedProduct.price)
          }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Favorite</span>
          <span class="detail-value">
            <span
              class="favorite-badge"
              :class="{
                'favorite-badge--yes': selectedProduct.favorite,
                'favorite-badge--no': !selectedProduct.favorite,
              }"
            >
              {{ selectedProduct.favorite ? 'Yes' : 'No' }}
            </span>
          </span>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.catalog-page {
  display: flex;
  gap: 2rem;
  min-height: 600px;
}

.catalog-container {
  flex: 1;
  min-width: 0;
}

/* Search Section */
.search-section {
  margin-bottom: 2rem;
}

.search-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 1rem;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.search-input:hover {
  border-color: var(--color-primary);
}

.search-input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Create Product Section */
.create-section {
  margin-bottom: 2rem;
}

.toggle-form-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 1rem;
  width: fit-content;
}

.toggle-form-button:hover {
  background-color: var(--color-primary-dark);
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.create-form {
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.form-input {
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.form-input:hover {
  border-color: var(--color-primary);
}

.form-input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-success);
  color: white;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 1rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #059669;
}

.submit-button:disabled {
  background-color: var(--color-text-light);
}

.form-error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-sm);
  color: var(--color-error);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* Products List */
.products-list {
  display: grid;
  gap: 1rem;
}

.product-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.product-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.product-card:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.product-card--selected {
  border-color: var(--color-primary);
  background-color: rgba(102, 126, 234, 0.05);
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.product-price {
  font-size: 1rem;
  color: var(--color-text-light);
  font-weight: 500;
}

.favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text-light);
  flex-shrink: 0;
  margin-left: 1rem;
}

.favorite-button:hover:not(:disabled) {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: var(--color-error);
  color: var(--color-error);
}

.favorite-button--active {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: var(--color-error);
  color: var(--color-error);
}

.favorite-button:disabled {
  opacity: 0.5;
}

.favorite-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Skeleton States */
.skeleton-card {
  pointer-events: none;
  cursor: default;
}

.skeleton-card:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-border);
}

.skeleton-title {
  height: 1.5rem;
  width: 60%;
  margin-bottom: 0.5rem;
}

.skeleton-price {
  height: 1.25rem;
  width: 30%;
}

.skeleton-button {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: var(--color-error);
  margin: 0 auto 1rem;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.error-message {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 1rem;
}

.retry-button:hover {
  background-color: var(--color-primary-dark);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--color-bg);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: var(--color-text-light);
  margin: 0 auto 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.empty-message {
  color: var(--color-text-light);
}

/* Detail Panel */
.detail-panel {
  width: 400px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
  box-shadow: var(--shadow-lg);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border);
}

.detail-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
}

.close-button {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-light);
}

.close-button:hover {
  background-color: var(--color-bg-alt);
  color: var(--color-text);
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.detail-row:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.detail-label {
  font-weight: 500;
  color: var(--color-text-light);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-weight: 500;
  color: var(--color-text);
  font-size: 1rem;
}

.favorite-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.favorite-badge--yes {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.favorite-badge--no {
  background-color: var(--color-bg-alt);
  color: var(--color-text-light);
}

/* Responsive */
@media (max-width: 1024px) {
  .detail-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 400px;
    border-radius: 0;
    z-index: 1000;
    box-shadow: -4px 0 6px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 640px) {
  .detail-panel {
    max-width: 100%;
  }
}
</style>

