# Branch Guide

## 📚 Repository Structure

This repository has two branches:

### `starter` Branch (For Candidates)
**Use this for interviews!**

Contains:
- ✅ Complete backend API (Express server)
- ✅ Complete frontend scaffolding (Vite, Vue 3, TypeScript, TanStack Query)
- ✅ API client with all methods ready to use
- ✅ Starter templates with TODO comments
- ✅ Basic component structure

**What candidates need to build:**
1. Complete the `useProducts` query hook
2. Build out the UI in `CatalogPage.vue`
3. Implement `useToggleFavorite` mutation with optimistic updates
4. (Stretch) Add detail panel with `useProduct`

**To use:**
```bash
git clone https://github.com/extole/extole-frontend-interview.git
cd extole-frontend-interview
git checkout starter
npm install
npm start
```

### `main` Branch (Reference Solution)
**Complete implementation for review**

Contains:
- ✅ Everything from starter branch
- ✅ Complete product list with search
- ✅ Favorite toggle with optimistic updates
- ✅ Create product functionality
- ✅ Product detail panel
- ✅ Full UI with loading states, error handling, accessibility
- ✅ Production-ready code with best practices

**To use:**
```bash
git checkout main
npm install
npm start
```

## 🎯 Interview Flow

1. **Before Interview**: Share the `starter` branch with the candidate
2. **During Interview**: Candidate clones and works on `starter` branch
3. **After Interview**: Review their work, compare with `main` branch solution

## 📝 What's in Each Branch

| Feature | Starter Branch | Main Branch |
|---------|---------------|-------------|
| Backend API | ✅ Complete | ✅ Complete |
| Frontend Setup | ✅ Complete | ✅ Complete |
| API Client | ✅ Complete | ✅ Complete |
| useProducts Hook | 🟡 Starter | ✅ Complete |
| useToggleFavorite Hook | 🟡 Starter | ✅ Complete |
| useProduct Hook | 🟡 Starter | ✅ Complete |
| useCreateProduct Hook | ❌ Not included | ✅ Complete |
| CatalogPage Component | 🟡 Basic structure | ✅ Complete UI |
| Styles | 🟡 Minimal | ✅ Complete |

## 🚀 Quick Commands

```bash
# Switch to starter
git checkout starter

# Switch to solution
git checkout main

# See differences
git diff starter main

# List all branches
git branch -a
```

