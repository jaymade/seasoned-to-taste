<template>
  <div class="recipe-detail">
    <header class="recipe-header">
      <router-link to="/dashboard" class="back-link"
        >← Back to Recipes</router-link
      >
    </header>

    <main class="recipe-main">
      <div v-if="loading" class="loading">Loading recipe...</div>
      <div v-else-if="!recipe" class="error">Recipe not found</div>

      <div v-else class="recipe-container">
        <div class="recipe-hero">
          <div class="recipe-title-section">
            <h1>{{ recipe.title }}</h1>
            <p class="author">By {{ recipe.author }}</p>
            <p class="description">{{ recipe.description }}</p>

            <div class="recipe-stats">
              <div class="stat">
                <span class="icon">🍽️</span>
                <span>{{ recipe.servings }} Servings</span>
              </div>
              <div class="stat">
                <span class="icon">⏱️</span>
                <span>Prep: {{ recipe.prepTime }} min</span>
              </div>
              <div class="stat">
                <span class="icon">🔥</span>
                <span>Cook: {{ recipe.cookTime }} min</span>
              </div>
            </div>

            <div v-if="isOwner" class="owner-actions">
              <router-link
                :to="`/recipe/${recipe.id}/edit`"
                class="btn-primary"
              >
                Edit Recipe
              </router-link>
              <button @click="deleteRecipe" class="btn-delete">
                Delete Recipe
              </button>
            </div>
          </div>
        </div>

        <div class="recipe-content">
          <div class="ingredients-section">
            <h2>Ingredients</h2>
            <ul class="ingredients-list">
              <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
                <input type="checkbox" :id="`ingredient-${ingredient.id}`" />
                <label :for="`ingredient-${ingredient.id}`">
                  <span class="quantity">{{ ingredient.quantity }}</span>
                  <span class="unit">{{ ingredient.unit }}</span>
                  <span class="name">{{ ingredient.name }}</span>
                </label>
              </li>
            </ul>

            <div class="recipe-notes">
              <h2>Notes</h2>
              <p>{{ recipe.description }}</p>
            </div>
          </div>

          <div class="directions-section">
            <div
              v-if="recipe.images.length > 0"
              class="recipe-image"
              :style="{ backgroundImage: `url(${recipe.images[0]})` }"
            ></div>
            <div v-else class="recipe-image-placeholder">No Image</div>

            <div class="direction">
              <h2>Preparation</h2>
              <p>{{ recipe.prepDirections }}</p>
            </div>

            <div class="direction">
              <h2>Cooking Instructions</h2>
              <p>{{ recipe.cookingDirections }}</p>
            </div>
          </div>
        </div>

        <div v-if="recipe.images.length > 1" class="additional-images">
          <h2>More Photos</h2>
          <div class="images-grid">
            <img
              v-for="(image, index) in recipe.images.slice(1)"
              :key="index"
              :src="image"
              :alt="recipe.title"
              class="thumbnail"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useRecipeStore } from "../stores/recipeStore";
import type { Recipe } from "../types";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const recipeStore = useRecipeStore();

const recipe = ref<Recipe | null | undefined>(null);
const loading = ref(true);

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  const recipeId = route.params.id as string;
  recipe.value = recipeStore.getRecipeById(recipeId);
  loading.value = false;

  if (!recipe.value) {
    router.push("/dashboard");
  }
});

const isOwner = computed(() => recipe.value?.authorId === authStore.user?.id);

const deleteRecipe = async () => {
  if (recipe.value && confirm("Are you sure you want to delete this recipe?")) {
    try {
      await recipeStore.deleteRecipe(recipe.value.id);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    }
  }
};
</script>

<style scoped>
.recipe-detail {
  min-height: 100vh;
  background:
    linear-gradient(rgba(235, 230, 223, 0.82), rgba(235, 230, 223, 0.82)),
    repeating-linear-gradient(90deg, #e2d8ca 0 2px, #eee7dc 2px 92px);
}

.recipe-header {
  background: var(--sage-dark);
  padding: 18px 0;
  border-bottom: 4px solid var(--gold);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-link {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: inline-block;
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.3s;
}

.back-link:hover {
  opacity: 0.8;
}

.recipe-main {
  max-width: 980px;
  margin: 0 auto;
  padding: 38px 20px 70px;
}

.loading,
.error {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 18px;
}

.recipe-container {
  background: var(--surface);
  border: 1px solid #d8d0c5;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 12px 26px rgba(59, 44, 27, 0.2);
}

.recipe-hero {
  padding: 44px 58px 0;
}

.recipe-image {
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  border-radius: 2px;
  box-shadow: 0 8px 20px rgba(59, 44, 27, 0.14);
}

.recipe-image-placeholder {
  width: 100%;
  height: 400px;
  background: #e8e2d7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-size: 18px;
  border-radius: 2px;
}

.recipe-title-section h1 {
  font-family: var(--sans);
  font-size: clamp(30px, 5vw, 52px);
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.05;
  margin: 0 0 8px 0;
  color: var(--ink);
}

.author {
  color: #d99db1;
  text-align: center;
  margin: 0 0 16px 0;
  font-size: 16px;
}

.description {
  display: none;
  text-align: center;
  margin: 0 0 25px 0;
  line-height: 1.6;
  font-size: 15px;
}

.recipe-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding: 15px 0;
  border-top: 1px solid #e5b5c6;
  border-bottom: 1px solid #e5b5c6;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.icon {
  font-size: 24px;
}

.stat span:last-child {
  color: var(--ink);
  font-weight: 600;
}

.owner-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
  padding-bottom: 14px;
  justify-content: center;
}

.btn-primary,
.btn-delete {
  padding: 8px 14px;
  border: none;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--coral);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-delete {
  background: #a94d3b;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.recipe-content {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 34px;
  padding: 34px 58px 48px;
  border-top: 1px solid #e5b5c6;
}

.ingredients-section h2,
.directions-section h2,
.additional-images h2 {
  font-size: 22px;
  margin: 0 0 20px 0;
  color: #d99db1;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--sans);
  font-size: 15px;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredients-list li {
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.ingredients-list li:last-child {
  border-bottom: none;
}

.ingredients-list input[type="checkbox"] {
  margin-right: 12px;
  cursor: pointer;
}

.ingredients-list label {
  cursor: pointer;
  display: flex;
  gap: 8px;
}

.ingredients-list input[type="checkbox"]:checked + label {
  opacity: 0.5;
  text-decoration: line-through;
}

.quantity {
  font-weight: 600;
  color: var(--coral);
  min-width: 50px;
}

.unit {
  color: var(--muted);
  min-width: 60px;
}

.name {
  color: var(--ink);
  flex: 1;
}

.direction {
  margin-bottom: 30px;
}

.directions-section .recipe-image,
.directions-section .recipe-image-placeholder {
  height: 215px;
  margin-bottom: 24px;
  box-shadow: none;
}

.recipe-notes {
  margin-top: 42px;
}

.recipe-notes p {
  color: var(--muted);
  line-height: 1.8;
}

.direction p {
  color: var(--muted);
  line-height: 1.7;
  margin: 0;
}

.additional-images {
  padding: 30px 58px 58px;
  border-top: 1px solid var(--line);
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
}

.thumbnail:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .recipe-hero {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .recipe-content {
    grid-template-columns: 1fr;
  }

  .recipe-stats {
    flex-direction: column;
  }

  .owner-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-delete {
    width: 100%;
  }
}
</style>
