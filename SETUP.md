# Setup Instructions for Interview

## For the Candidate

This is a complete, ready-to-run Vue 3 + TypeScript + TanStack Query project with a real Express backend.

### Running the Project

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
   This automatically installs both frontend and backend dependencies.

3. Start both servers:
   ```bash
   npm start
   ```
   This starts:
   - **Backend API**: http://localhost:3001
   - **Frontend Dev Server**: http://localhost:5173

4. Open http://localhost:5173 in your browser

### What's Already Built

The project comes with a **complete, working implementation** as a reference solution:

#### Features Implemented
- ✅ Product list with search filtering
- ✅ Loading skeletons (not spinners)
- ✅ Error states with retry functionality
- ✅ Favorite toggle with optimistic updates
- ✅ Create new products
- ✅ Product detail panel
- ✅ Full accessibility (ARIA, keyboard navigation)
- ✅ Real backend API with persistent storage

#### Backend API (Express)
- In-memory database (persists while server runs)
- Simulated 300-400ms latency
- 15% random failure rate (to test error handling)
- Endpoints:
  - `GET /api/products?search=` - List products
  - `GET /api/products/:id` - Get product by ID
  - `POST /api/products/:id/favorite` - Toggle favorite
  - `POST /api/products` - Create product

#### Frontend Structure
```
src/
├── features/
│   └── catalog/
│       ├── api.ts                    # Axios API client
│       ├── useProducts.ts            # List query hook
│       ├── useProduct.ts             # Detail query hook  
│       ├── useToggleFavorite.ts      # Mutation hook
│       ├── useCreateProduct.ts       # Mutation hook
│       └── CatalogPage.vue           # Main component
├── App.vue
├── main.ts
└── styles.css
```

### Project Architecture Highlights

#### TanStack Query Best Practices
- ✅ Query keys include all parameters
- ✅ `keepPreviousData` for search to prevent layout shift
- ✅ Optimistic updates with snapshot/rollback on error
- ✅ `placeholderData` from cache to avoid empty states
- ✅ Proper cache invalidation patterns
- ✅ Default `staleTime` configured globally (10s)

#### Vue 3 Best Practices
- ✅ Composition API with `<script setup>`
- ✅ Small, focused composables (one per query/mutation)
- ✅ Refs passed directly to query hooks (reactive)
- ✅ No unnecessary watchers

#### Code Quality
- ✅ TypeScript with strict mode
- ✅ ESLint + Prettier configured
- ✅ Feature-first folder structure
- ✅ Separation of concerns (API, hooks, components)

### For the Interviewer

This project can be used in multiple ways:

1. **Reference Implementation**: Show the candidate the complete solution
2. **Starting Point**: Have them extend it (add sorting, pagination, etc.)
3. **Code Review**: Discuss the implementation and design decisions
4. **Fresh Start**: Have them build from scratch in a new branch

### Stopping the Servers

Press `Ctrl+C` in the terminal to stop both servers.

### Troubleshooting

**Port already in use?**
```bash
# Kill processes on ports 3001 and 5173
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**Backend not connecting?**
- Verify the API server started (you should see "✅ API Server running")
- Check http://localhost:3001/api/products in your browser
- Frontend expects backend at `http://localhost:3001`

**Changes not reflecting?**
- Vite has HMR (Hot Module Replacement) - most changes appear instantly
- TypeScript changes may need a full reload
- Backend changes require restarting `npm start`

