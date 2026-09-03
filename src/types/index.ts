export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g., 'cups', 'tbsp', 'grams', 'oz'
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  ingredients: Ingredient[];
  servings: number;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  prepDirections: string;
  cookingDirections: string;
  images: string[]; // array of image URLs
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: Ingredient[];
  servings: number;
  prepTime: number;
  cookTime: number;
  prepDirections: string;
  cookingDirections: string;
  images: string[];
  isPublic: boolean;
}
