# Development Guide - Seasoned to Taste

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

### `/src`
Main source code directory

#### `/src/views`
- `LoginView.vue` - Authentication page (login/register)
- `DashboardView.vue` - Main dashboard with recipe lists
- `RecipeDetailView.vue` - Full recipe display
- `RecipeFormView.vue` - Add/edit recipe form

#### `/src/stores`
- `authStore.ts` - Pinia store for authentication state
- `recipeStore.ts` - Pinia store for recipe data

#### `/src/types`
- `index.ts` - TypeScript interfaces and types

#### `/src/router`
- `index.ts` - Vue Router configuration and navigation guards

#### `/src/components`
Reusable Vue components (ready for future additions)

#### `/src/services`
API service modules (ready for backend integration)

## Development Workflow

### Adding a New Feature

1. **Create TypeScript Types** (if needed)
   - Add to `src/types/index.ts`

2. **Update State Management**
   - Add actions to appropriate store in `src/stores/`

3. **Create Components/Views**
   - Add new `.vue` files in `src/components/` or `src/views/`

4. **Update Router** (if new page)
   - Add route to `src/router/index.ts`

5. **Style as Needed**
   - Use scoped styles in `.vue` components
   - Follow existing gradient theme (purple/blue)

### Common Tasks

#### Add a New View/Page
1. Create file in `src/views/` named `[Feature]View.vue`
2. Add route in `src/router/index.ts`
3. Link from other components using `<router-link>`

#### Add State Management
1. Define actions/state in `src/stores/`
2. Import store in component: `const store = useRecipeStore()`
3. Use computed properties for reactive data

#### Create Reusable Component
1. Create file in `src/components/`
2. Export component and use in views
3. Keep components focused and single-responsibility

## State Management (Pinia)

### Auth Store
```typescript
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
// Access
authStore.user
authStore.isAuthenticated
// Actions
authStore.login(email, password)
authStore.register(email, password, name)
authStore.logout()
```

### Recipe Store
```typescript
import { useRecipeStore } from '@/stores/recipeStore'

const recipeStore = useRecipeStore()
// Access
recipeStore.recipes
recipeStore.userRecipes
recipeStore.publicRecipes
// Actions
recipeStore.fetchAllRecipes()
recipeStore.addRecipe(formData)
recipeStore.updateRecipe(id, formData)
recipeStore.deleteRecipe(id)
```

## Styling Guidelines

### Color Palette
- Primary Gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Background: `#f5f5f5`
- Text Dark: `#333`
- Text Medium: `#666`
- Text Light: `#999`
- Border: `#ddd`
- Error: `#e74c3c`

### Responsive Breakpoints
```css
/* Mobile first approach */
/* Tablet: 768px */
@media (max-width: 768px) { }

/* Desktop: 1200px+ */
/* Default for larger screens */
```

### Component Pattern
```vue
<template>
  <div class="component-name">
    <!-- content -->
  </div>
</template>

<script setup lang="ts">
// Imports
// Component logic
</script>

<style scoped>
/* Scoped styles */
</style>
```

## Testing Workflow

### Manual Testing Checklist
- [ ] Login/Register works
- [ ] Can create recipe
- [ ] Can edit own recipe
- [ ] Can delete own recipe
- [ ] Can view public recipes
- [ ] Cannot modify other's recipes
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Form validation works
- [ ] Responsive on mobile

## Backend Integration Checklist

When connecting to a backend API:

- [ ] Create `src/services/api.ts` with axios setup
- [ ] Create `src/services/authService.ts`
- [ ] Create `src/services/recipeService.ts`
- [ ] Update `authStore.ts` to use API
- [ ] Update `recipeStore.ts` to use API
- [ ] Add environment variables to `.env`
- [ ] Implement proper error handling
- [ ] Add loading states
- [ ] Implement token refresh logic
- [ ] Add request/response interceptors

### API Endpoints Expected

```
Auth:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

Recipes:
GET    /api/recipes
POST   /api/recipes
GET    /api/recipes/:id
PUT    /api/recipes/:id
DELETE /api/recipes/:id
GET    /api/recipes/user/:userId
```

## Deployment Preparation

### Pre-deployment Checklist
- [ ] Run `npm run build` - check for errors
- [ ] Test production build locally with `npm run preview`
- [ ] Update version in `package.json`
- [ ] Update `.env.production` with API endpoint
- [ ] Review all console logs and remove debug logs
- [ ] Test on multiple browsers
- [ ] Test responsive design on multiple devices

### AWS Deployment Steps

1. **Build the project**
   ```bash
   npm run build
   ```

2. **AWS Amplify (Recommended)**
   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify add hosting
   amplify publish
   ```

3. **AWS S3 + CloudFront**
   - Upload `dist/` folder to S3 bucket
   - Configure CloudFront distribution
   - Point domain name to CloudFront

4. **Environment Setup**
   - Create `.env.production` with API endpoint
   - Set up CI/CD pipeline for automatic deployments

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint TypeScript (when added)
npm run type-check   # Check types

# Install Dependencies
npm install          # Install all dependencies
npm install package  # Add new package
```

## Debugging

### Browser DevTools
1. Open DevTools (F12 or Cmd+Option+I)
2. Vue DevTools for component inspection
3. Network tab for API calls
4. Console for errors and logs

### VS Code
- Install "Volar" extension for Vue 3 support
- Use VS Code Debugger for debugging

### Common Issues

**Port already in use**
```bash
# Find process on port 5173
lsof -i :5173
# Kill process
kill -9 <PID>
```

**Dependencies not installing**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
# Clear Vite cache
rm -rf .vite
npm run dev
```

## Performance Optimization

- Lazy load recipe images
- Implement pagination for recipe lists
- Use computed properties for derived state
- Minimize re-renders with proper key binding
- Consider virtual scrolling for large lists

## Security Considerations

- Sanitize user input (XSS prevention)
- Validate form data before submission
- Store auth token securely
- Implement CORS properly on backend
- Use HTTPS in production
- Implement rate limiting on backend

## Future Enhancements

### Phase 2
- [ ] User profiles
- [ ] Recipe search
- [ ] Recipe categories/tags
- [ ] Favorites system

### Phase 3
- [ ] Comments/ratings
- [ ] Meal planning
- [ ] Shopping lists
- [ ] Social features

### Phase 4
- [ ] Mobile app
- [ ] Offline support
- [ ] Recipe export/PDF
- [ ] Advanced analytics

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

## Questions?

Feel free to open an issue or reach out for help!

Happy coding! 👨‍💻👩‍💻
