# Seasoned to Taste 🍳

A Vue3 recipe collection app for friends and family to share and manage their favorite recipes.

## Features

- **User Authentication**
  - Register new account
  - Login with email and password
  - Session persistence

- **Recipe Management**
  - Create new recipes with full details
  - Edit your own recipes
  - Delete your recipes
  - View all public recipes from other users

- **Recipe Details**
  - Ingredients with quantities and units
  - Preparation instructions
  - Cooking/baking instructions
  - Servings information
  - Prep and cook times
  - Multiple recipe images

- **Browse & Explore**
  - View all community recipes
  - View detailed recipe information
  - Read-only access to other users' recipes

## Tech Stack

- **Frontend Framework**: Vue 3 with TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios (configured for API integration)
- **Styling**: CSS3 with responsive design

## Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable Vue components
├── views/            # Page components
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── RecipeDetailView.vue
│   └── RecipeFormView.vue
├── stores/           # Pinia state management
│   ├── authStore.ts
│   └── recipeStore.ts
├── types/            # TypeScript type definitions
├── router/           # Vue Router configuration
├── services/         # API services (ready for backend)
├── App.vue
└── main.ts
```

## Using the App

### Create Account
1. Click "Register here" on login page
2. Fill in email, password, and name
3. Click Register

### Add a Recipe
1. Click "+ Add New Recipe" on dashboard
2. Fill in recipe details:
   - Title and description
   - Ingredients with quantities
   - Preparation and cooking instructions
   - Servings and times
   - Images (via URL)
3. Make public to share with community
4. Click "Create Recipe"

### Browse & Share
- View your recipes in "My Recipes" tab
- Browse community recipes in "Browse All Recipes" tab
- Edit or delete only your own recipes
- View others' recipes in read-only mode

## Data Models

### Recipe Structure
```typescript
{
  id: string;
  title: string;
  description: string;
  author: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string; // cups, tbsp, grams, etc.
  }>;
  servings: number;
  prepTime: number; // minutes
  cookTime: number; // minutes
  prepDirections: string;
  cookingDirections: string;
  images: string[]; // URLs
  isPublic: boolean;
}
```

## Authentication

- Users must login to access the app
- Create an account with email and password
- Session persists using localStorage
- Only edit/delete your own recipes
- View all public community recipes

## Future Enhancements

- [ ] Backend API integration (Node.js, Python, etc.)
- [ ] User profiles and avatars
- [ ] Recipe search and filtering
- [ ] Recipe ratings and reviews
- [ ] Meal planning features
- [ ] Shopping list generation
- [ ] Image upload support
- [ ] Recipe collections and categories
- [ ] Favorite recipes
- [ ] Social sharing
- [ ] Comments and discussions
- [ ] Recipe export to PDF

## Backend Integration Guide

To connect to a backend API:

1. **Update `src/stores/authStore.ts`**
   - Replace mock login/register with API calls
   - Implement token-based authentication

2. **Update `src/stores/recipeStore.ts`**
   - Replace mock data with API calls
   - Implement actual CRUD operations

3. **Create API service files in `src/services/`**
   - `api.ts` - axios configuration
   - `authService.ts` - auth endpoints
   - `recipeService.ts` - recipe endpoints

4. **Expected API Endpoints**
   ```
   POST   /api/auth/register
   POST   /api/auth/login
   GET    /api/recipes
   POST   /api/recipes
   GET    /api/recipes/:id
   PUT    /api/recipes/:id
   DELETE /api/recipes/:id
   ```

## Deployment to AWS

When ready for production:

1. Build the app: `npm run build`
2. Deploy options:
   - **AWS Amplify** - Easiest for Vue apps
   - **AWS S3 + CloudFront** - Static hosting
   - **AWS Elastic Beanstalk** - With backend
   - **AWS AppSync** - GraphQL backend

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

---

Happy cooking! 👨‍🍳👩‍🍳
