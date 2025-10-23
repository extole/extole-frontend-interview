# Vue + TanStack Query Live Exercise (60 minutes)

Welcome! In this interview we'll build a small Product Catalog in Vue 3 + TypeScript using @tanstack/vue-query. The exercise is progressive: even partial progress is useful, and there are stretch tasks if you fly.

## Quick Start

```bash
git clone https://github.com/extole/extole-frontend-interview.git
cd extole-frontend-interview
git checkout starter  # Use the starter branch for the interview
npm install
npm start
```

Then open **http://localhost:5173** in your browser. Both the API server (port 3001) and dev server (port 5173) will start automatically.

> **Note**: The `main` branch contains a complete reference solution. Use the `starter` branch for the interview.

## Goals

- Show you can fetch & render data with TanStack Query.
- Add a search filter that refetches with parameterized query keys.
- Implement a mutation with optimistic update (toggle "favorite").
- If time allows: a product detail panel that reuses cached data.

## What we evaluate

- **Correctness & API usage** (query keys, staleTime, invalidation)
- **Code organization** (small composables, clear names)
- **Reactivity fluency** (ref/computed; avoid unnecessary watchers)
- **Error/loading UX** (skeletons, disabled actions, retries)
- **Communication**: narrate tradeoffs and thinking

## Running locally

```bash
npm install        # Install all dependencies (frontend + backend)
npm start          # Starts both API server (port 3001) and Vite dev server (port 5173)
```

That's it! The `npm install` command automatically installs backend dependencies via postinstall hook, and `npm start` runs both servers concurrently.

Open **http://localhost:5173** in your browser.

### API Server

The backend Express server runs on **http://localhost:3001** with these endpoints:
- `GET /api/products?search=` - Fetch products
- `GET /api/products/:id` - Fetch single product
- `POST /api/products/:id/favorite` - Toggle favorite
- `POST /api/products` - Create new product

Data persists in memory while the server is running.

## Exercise Steps (in order)

### 1. Render the list

- Fetch products and render name, price, and a favorite indicator.
- Show loading skeletons and a friendly error state with a Retry button.

### 2. Add search

- Text input bound to search.
- Query key should include `{ search }` param.
- Debounce is optional; discuss tradeoffs if you skip it.

### 3. Favorite toggle (mutation + optimistic update)

- "Favorite/Unfavorite" button per row.
- In `onMutate`: cancel queries, snapshot previous list, optimistically flip, and return context.
- In `onError`: rollback from snapshot.
- In `onSettled`: invalidate list (and detail if implemented).

### 4. Detail panel (stretch)

- Click a row to open details (by ID) in a side panel.
- Use `placeholderData` pulling from the list cache to avoid empty states.

## Bonus touches (time permitting)

- Keyboard focus states; aria-pressed on favorite.
- Button loading states.
- Discuss pagination (offset vs cursor) and when to use `useInfiniteQuery`.

## Backend API

A real Express backend (`server/index.js`) provides persistent storage. The API simulates latency and occasional errors:

**Features:**
- In-memory database (persists while server runs)
- 300-400ms simulated latency on all requests
- 15% random failure rate to test error handling and rollback
- Full CRUD operations

**Initial Data:**
```javascript
[
  { id: "p1", name: "Aluminum Bracket", price: 29.99, favorite: false },
  { id: "p2", name: "Steel Gusset", price: 14.5, favorite: true },
  { id: "p3", name: "M6 Flanged Nut", price: 0.49, favorite: false },
  { id: "p4", name: "Rivnut Tool", price: 64.0, favorite: false },
  { id: "p5", name: "Dimple Die 1in", price: 24.75, favorite: false },
]
```

**Frontend API Client** (`src/features/catalog/api.ts`):
```typescript
import axios from 'axios'

export async function fetchProducts(search: string): Promise<Product[]> {
  const response = await axios.get(`http://localhost:3001/api/products`, {
    params: { search },
  })
  return response.data
}

export async function toggleFavorite(id: string): Promise<Product> {
  const response = await axios.post(`http://localhost:3001/api/products/${id}/favorite`)
  return response.data
}
```

## Files you'll work in

All files are in `src/features/catalog/`:

- **`CatalogPage.vue`** - Main component (basic structure provided)
- **`useProducts.ts`** - Query hook for product list (starter provided)
- **`useToggleFavorite.ts`** - Mutation hook for favorites (starter provided)
- **`useProduct.ts`** - Query hook for product details (stretch goal)
- **`api.ts`** - API client (complete - ready to use!)

The API client and backend are fully implemented. Focus on building the frontend with TanStack Query.

## Discussion prompts (if time remains)

- Where would you put `staleTime` / `gcTime` defaults?
- What belongs in the TanStack cache vs component state vs Pinia?
- Prefetching detail on hover?
- Pagination & sorting strategy.

Good luck—talk through your decisions as you code!

