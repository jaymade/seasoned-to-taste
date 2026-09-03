<template>
  <div class="recipe-form">
    <header class="recipe-header">
      <router-link to="/dashboard" class="back-link"
        >← Back to Dashboard</router-link
      >
    </header>

    <main class="form-main">
      <div class="form-container">
        <h1>{{ isEdit ? "Edit Recipe" : "Add New Recipe" }}</h1>

        <form @submit.prevent="handleSubmit">
          <!-- Basic Info Section -->
          <section class="form-section">
            <h2>Recipe Details</h2>

            <div class="form-group">
              <label for="title">Recipe Title *</label>
              <input
                v-model="form.title"
                type="text"
                id="title"
                placeholder="e.g., Grandma's Apple Pie"
                required
              />
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea
                v-model="form.description"
                id="description"
                placeholder="Describe your recipe..."
                rows="4"
                required
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="servings">Servings *</label>
                <input
                  v-model.number="form.servings"
                  type="number"
                  id="servings"
                  min="1"
                  required
                />
              </div>

              <div class="form-group">
                <label for="prepTime">Prep Time (minutes) *</label>
                <input
                  v-model.number="form.prepTime"
                  type="number"
                  id="prepTime"
                  min="0"
                  required
                />
              </div>

              <div class="form-group">
                <label for="cookTime">Cook Time (minutes) *</label>
                <input
                  v-model.number="form.cookTime"
                  type="number"
                  id="cookTime"
                  min="0"
                  required
                />
              </div>
            </div>

            <div class="form-group checkbox">
              <input v-model="form.isPublic" type="checkbox" id="isPublic" />
              <label for="isPublic"
                >Make this recipe public (visible to others)</label
              >
            </div>
          </section>

          <!-- Ingredients Section -->
          <section class="form-section">
            <h2>Ingredients</h2>

            <div
              v-for="(ingredient, index) in form.ingredients"
              :key="index"
              class="ingredient-row"
            >
              <input
                :value="ingredient.quantity"
                @input="
                  ingredient.quantity =
                    parseFloat(($event.target as HTMLInputElement).value) || 0
                "
                type="number"
                placeholder="Quantity"
                step="0.01"
                min="0"
              />
              <input
                :value="ingredient.unit"
                @input="
                  ingredient.unit = ($event.target as HTMLInputElement).value
                "
                type="text"
                placeholder="Unit (cup, tbsp, g, etc)"
              />
              <input
                :value="ingredient.name"
                @input="
                  ingredient.name = ($event.target as HTMLInputElement).value
                "
                type="text"
                placeholder="Ingredient name"
              />
              <button
                type="button"
                @click="removeIngredient(index)"
                class="btn-remove"
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              @click="addIngredient"
              class="btn-add-ingredient"
            >
              + Add Ingredient
            </button>
          </section>

          <!-- Directions Section -->
          <section class="form-section">
            <h2>Preparation Instructions</h2>
            <div class="form-group">
              <label for="prepDirections">Prep Directions *</label>
              <textarea
                v-model="form.prepDirections"
                id="prepDirections"
                placeholder="Step-by-step preparation instructions..."
                rows="6"
                required
              ></textarea>
            </div>
          </section>

          <section class="form-section">
            <h2>Cooking Instructions</h2>
            <div class="form-group">
              <label for="cookingDirections">Cooking/Baking Directions *</label>
              <textarea
                v-model="form.cookingDirections"
                id="cookingDirections"
                placeholder="Step-by-step cooking or baking instructions..."
                rows="6"
                required
              ></textarea>
            </div>
          </section>

          <!-- Images Section -->
          <section class="form-section">
            <h2>Images</h2>
            <div class="image-info">
              <p>Add image URLs to display photos of your recipe</p>
            </div>

            <div
              v-for="(image, index) in form.images"
              :key="index"
              class="image-row"
            >
              <input
                :value="image"
                @input="
                  form.images[index] = ($event.target as HTMLInputElement).value
                "
                type="url"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                @click="removeImage(index)"
                class="btn-remove"
              >
                ✕
              </button>
            </div>

            <button type="button" @click="addImage" class="btn-add-ingredient">
              + Add Image URL
            </button>
          </section>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" @click="$router.back()" class="btn-cancel">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="btn-primary">
              {{ isEdit ? "Update Recipe" : "Create Recipe" }}
            </button>
          </div>

          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useRecipeStore } from "../stores/recipeStore";
import type { RecipeFormData } from "../types";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const recipeStore = useRecipeStore();

const loading = ref(false);
const error = ref("");

const isEdit = computed(() => route.params.id);

const form = reactive<RecipeFormData>({
  title: "",
  description: "",
  ingredients: [{ id: "1", name: "", quantity: 0, unit: "" }],
  servings: 4,
  prepTime: 0,
  cookTime: 0,
  prepDirections: "",
  cookingDirections: "",
  images: [""],
  isPublic: true,
});

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  if (isEdit.value) {
    const recipe = recipeStore.getRecipeById(route.params.id as string);
    if (recipe && recipe.authorId === authStore.user?.id) {
      form.title = recipe.title;
      form.description = recipe.description;
      form.ingredients = recipe.ingredients.map((ing) => ({
        ...ing,
        id: Math.random().toString(36).substr(2, 9),
      }));
      form.servings = recipe.servings;
      form.prepTime = recipe.prepTime;
      form.cookTime = recipe.cookTime;
      form.prepDirections = recipe.prepDirections;
      form.cookingDirections = recipe.cookingDirections;
      form.images = recipe.images.length > 0 ? [...recipe.images, ""] : [""];
      form.isPublic = recipe.isPublic;
    } else {
      router.push("/dashboard");
    }
  }
});

const addIngredient = () => {
  form.ingredients.push({
    id: Math.random().toString(36).substr(2, 9),
    name: "",
    quantity: 0,
    unit: "",
  });
};

const removeIngredient = (index: number) => {
  form.ingredients.splice(index, 1);
};

const addImage = () => {
  form.images.push("");
};

const removeImage = (index: number) => {
  form.images.splice(index, 1);
};

const handleSubmit = async () => {
  error.value = "";
  loading.value = true;

  try {
    // Validate and clean form data
    const cleanedForm = {
      ...form,
      ingredients: form.ingredients.filter(
        (ing) => ing.name && ing.quantity > 0,
      ),
      images: form.images.filter((img) => img.trim()),
    };

    if (cleanedForm.ingredients.length === 0) {
      error.value = "Please add at least one ingredient";
      return;
    }

    if (isEdit.value) {
      await recipeStore.updateRecipe(route.params.id as string, cleanedForm);
    } else {
      await recipeStore.addRecipe(cleanedForm);
    }

    router.push("/dashboard");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to save recipe";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.recipe-form {
  min-height: 100vh;
  background: #ebe6df;
}

.recipe-header {
  background: var(--sage-dark);
  padding: 18px 0;
  border-bottom: 4px solid var(--gold);
}

.back-link {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: inline-block;
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.form-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.form-container {
  background: var(--surface);
  padding: 48px 54px;
  border: 1px solid #d8d0c5;
  border-radius: 2px;
  box-shadow: 0 8px 20px rgba(59, 44, 27, 0.08);
}

.form-container h1 {
  font-size: 42px;
  margin: 0 0 30px 0;
  color: var(--ink);
}

.form-section {
  margin-bottom: 40px;
}

.form-section h2 {
  font-size: 18px;
  margin: 0 0 20px 0;
  color: var(--ink);
  border-bottom: 1px solid var(--ink);
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

input[type="text"],
input[type="number"],
input[type="url"],
textarea,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 2px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgba(80, 97, 77, 0.12);
}

textarea {
  resize: vertical;
  line-height: 1.5;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.form-group.checkbox input {
  width: auto;
  margin: 0;
}

.form-group.checkbox label {
  margin: 0;
}

.ingredient-row,
.image-row {
  display: grid;
  grid-template-columns: 1fr 150px 1fr 50px;
  gap: 10px;
  margin-bottom: 12px;
  align-items: center;
}

.ingredient-row input,
.image-row input {
  padding: 10px;
  font-size: 13px;
}

.btn-remove {
  background: #a94d3b;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 2px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-remove:hover {
  background: #873e31;
}

.btn-add-ingredient {
  background: transparent;
  border: 1px dashed var(--sage);
  color: var(--sage-dark);
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-add-ingredient:hover {
  background: #eef1eb;
}

.image-info {
  background: #f3eee7;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 13px;
  color: var(--muted);
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 40px;
}

.btn-primary,
.btn-cancel {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--coral);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: transparent;
  color: var(--sage-dark);
  border: 1px solid var(--line);
}

.btn-cancel:hover {
  background: #f1ece4;
}

.error-message {
  color: #a94d3b;
  font-size: 14px;
  margin-top: 15px;
  text-align: center;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .ingredient-row,
  .image-row {
    grid-template-columns: 1fr 40px;
  }

  .ingredient-row input:nth-child(2),
  .image-row input:nth-child(2) {
    display: none;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
