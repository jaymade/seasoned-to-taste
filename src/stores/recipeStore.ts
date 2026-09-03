import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Recipe, RecipeFormData } from "../types";
import { useAuthStore } from "./authStore";

export const useRecipeStore = defineStore("recipe", () => {
  const recipes = ref<Recipe[]>([]);
  const userRecipes = ref<Recipe[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Mock data for demonstration
  const initializeMockData = () => {
    recipes.value = [
      {
        id: "1",
        title: "Classic Chocolate Chip Cookies",
        description: "Delicious homemade cookies with chocolate chips",
        author: "Sarah Johnson",
        authorId: "user1",
        ingredients: [
          { id: "1", name: "Butter", quantity: 2, unit: "cups" },
          { id: "2", name: "Sugar", quantity: 1.5, unit: "cups" },
          { id: "3", name: "Eggs", quantity: 2, unit: "whole" },
          { id: "4", name: "Vanilla Extract", quantity: 1, unit: "tbsp" },
          { id: "5", name: "Flour", quantity: 2.5, unit: "cups" },
          { id: "6", name: "Chocolate Chips", quantity: 2, unit: "cups" },
        ],
        servings: 24,
        prepTime: 15,
        cookTime: 12,
        prepDirections:
          "Cream butter and sugar together. Add eggs and vanilla.",
        cookingDirections:
          "Bake at 375°F for 10-12 minutes until golden brown.",
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
      },
    ];
  };

  const fetchAllRecipes = async () => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API call
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (recipes.value.length === 0) {
        initializeMockData();
      }
    } catch (err) {
      error.value = "Failed to fetch recipes";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchUserRecipes = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      userRecipes.value = recipes.value.filter((r) => r.authorId === userId);
    } catch (err) {
      error.value = "Failed to fetch user recipes";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const addRecipe = async (formData: RecipeFormData) => {
    const authStore = useAuthStore();
    if (!authStore.user) {
      throw new Error("User not authenticated");
    }

    loading.value = true;
    error.value = null;
    try {
      const newRecipe: Recipe = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        author: authStore.user.name,
        authorId: authStore.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // TODO: Replace with actual API call
      recipes.value.push(newRecipe);
      userRecipes.value.push(newRecipe);
      return newRecipe;
    } catch (err) {
      error.value = "Failed to add recipe";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateRecipe = async (recipeId: string, formData: RecipeFormData) => {
    loading.value = true;
    error.value = null;
    try {
      const index = recipes.value.findIndex((r) => r.id === recipeId);
      if (index === -1) {
        throw new Error("Recipe not found");
      }

      // TODO: Replace with actual API call
      recipes.value[index] = {
        ...recipes.value[index],
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      const userIndex = userRecipes.value.findIndex((r) => r.id === recipeId);
      if (userIndex !== -1) {
        userRecipes.value[userIndex] = recipes.value[index];
      }

      return recipes.value[index];
    } catch (err) {
      error.value = "Failed to update recipe";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    loading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API call
      recipes.value = recipes.value.filter((r) => r.id !== recipeId);
      userRecipes.value = userRecipes.value.filter((r) => r.id !== recipeId);
    } catch (err) {
      error.value = "Failed to delete recipe";
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getRecipeById = (id: string) => {
    return recipes.value.find((r) => r.id === id);
  };

  const publicRecipes = computed(() => recipes.value.filter((r) => r.isPublic));

  return {
    recipes,
    userRecipes,
    loading,
    error,
    publicRecipes,
    fetchAllRecipes,
    fetchUserRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  };
});
