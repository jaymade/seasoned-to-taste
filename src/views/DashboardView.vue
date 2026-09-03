<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>{{ authStore.user?.name }}'s Kitchen</h1>
        <button @click="logout" class="btn-logout">Logout</button>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="search-bar">
        <span class="search-icon" aria-hidden="true">⌕</span>
        <input
          v-model="searchQuery"
          type="search"
          aria-label="Search recipes"
          placeholder="Search by recipe, ingredient, or servings..."
        />
        <button
          v-if="searchQuery"
          type="button"
          class="clear-search"
          aria-label="Clear recipe search"
          @click="searchQuery = ''"
        >
          ×
        </button>
      </div>

      <div class="tabs">
        <button
          :class="['tab', { active: activeTab === 'my-recipes' }]"
          @click="activeTab = 'my-recipes'"
        >
          My Recipes
        </button>
        <button
          :class="['tab', { active: activeTab === 'browse' }]"
          @click="activeTab = 'browse'"
        >
          Browse All Recipes
        </button>
      </div>

      <div class="tab-content">
        <!-- My Recipes Tab -->
        <section v-if="activeTab === 'my-recipes'" class="recipes-section">
          <div class="section-header">
            <h2>My Recipes</h2>
            <router-link to="/recipe/new" class="btn-primary">
              + Add New Recipe
            </router-link>
          </div>

          <div v-if="loading" class="loading">Loading recipes...</div>

          <div v-else-if="filteredUserRecipes.length === 0" class="empty">
            <p>
              {{
                searchQuery
                  ? "No recipes match your search."
                  : "No recipes yet. Create your first recipe!"
              }}
            </p>
          </div>

          <div v-else class="recipes-grid">
            <div
              v-for="recipe in filteredUserRecipes"
              :key="recipe.id"
              class="recipe-card"
            >
              <div
                v-if="recipe.images.length > 0"
                class="recipe-image"
                :style="{ backgroundImage: `url(${recipe.images[0]})` }"
              ></div>
              <div v-else class="recipe-image-placeholder">No Image</div>

              <div class="recipe-info">
                <h3>{{ recipe.title }}</h3>
                <p class="description">{{ recipe.description }}</p>
                <div class="recipe-meta">
                  <span class="time">
                    <span class="icon">⏱️</span> {{ recipe.cookTime }} min
                  </span>
                  <span class="servings">
                    <span class="icon">🍽️</span> {{ recipe.servings }}
                    servings
                  </span>
                </div>

                <div class="recipe-actions">
                  <router-link
                    :to="`/recipe/${recipe.id}`"
                    class="btn-secondary"
                  >
                    View
                  </router-link>
                  <router-link
                    :to="`/recipe/${recipe.id}/edit`"
                    class="btn-secondary"
                  >
                    Edit
                  </router-link>
                  <button @click="deleteRecipe(recipe.id)" class="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Browse Recipes Tab -->
        <section v-if="activeTab === 'browse'" class="recipes-section">
          <h2>Community Recipes</h2>

          <div v-if="loading" class="loading">Loading recipes...</div>

          <div v-else-if="filteredPublicRecipes.length === 0" class="empty">
            <p>
              {{
                searchQuery
                  ? "No recipes match your search."
                  : "No public recipes available yet."
              }}
            </p>
          </div>

          <div v-else class="recipes-grid">
            <div
              v-for="recipe in filteredPublicRecipes"
              :key="recipe.id"
              class="recipe-card"
            >
              <div
                v-if="recipe.images.length > 0"
                class="recipe-image"
                :style="{ backgroundImage: `url(${recipe.images[0]})` }"
              ></div>
              <div v-else class="recipe-image-placeholder">No Image</div>

              <div class="recipe-info">
                <h3>{{ recipe.title }}</h3>
                <p class="author">By {{ recipe.author }}</p>
                <p class="description">{{ recipe.description }}</p>
                <div class="recipe-meta">
                  <span class="time">
                    <span class="icon">⏱️</span> {{ recipe.cookTime }} min
                  </span>
                  <span class="servings">
                    <span class="icon">🍽️</span> {{ recipe.servings }}
                    servings
                  </span>
                </div>

                <router-link :to="`/recipe/${recipe.id}`" class="btn-primary">
                  View Recipe
                </router-link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useRecipeStore } from "../stores/recipeStore";

const router = useRouter();
const authStore = useAuthStore();
const recipeStore = useRecipeStore();

const activeTab = ref("my-recipes");
const loading = ref(false);
const searchQuery = ref("");

const matchesSearch = (recipe: (typeof recipeStore.recipes)[number]) => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return true;

  return (
    recipe.title.toLowerCase().includes(query) ||
    recipe.ingredients.some((ingredient) =>
      ingredient.name.toLowerCase().includes(query),
    ) ||
    String(recipe.servings).includes(query)
  );
};

const filteredUserRecipes = computed(() =>
  recipeStore.userRecipes.filter(matchesSearch),
);

const filteredPublicRecipes = computed(() =>
  recipeStore.publicRecipes.filter(matchesSearch),
);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  loading.value = true;
  try {
    await recipeStore.fetchAllRecipes();
    if (authStore.user) {
      await recipeStore.fetchUserRecipes(authStore.user.id);
    }
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
  } finally {
    loading.value = false;
  }
});

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const deleteRecipe = async (recipeId: string) => {
  if (confirm("Are you sure you want to delete this recipe?")) {
    try {
      await recipeStore.deleteRecipe(recipeId);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    }
  }
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--paper);
}

.dashboard-header {
  background-color: #a9d8d1;
  background-image:
    radial-gradient(
      circle at 18% 35%,
      rgba(255, 249, 226, 0.72) 0 4px,
      transparent 5px
    ),
    radial-gradient(
      circle at 82% 65%,
      rgba(255, 249, 226, 0.58) 0 3px,
      transparent 4px
    ),
    linear-gradient(90deg, rgba(255, 249, 226, 0.34) 50%, transparent 50%),
    linear-gradient(rgba(255, 249, 226, 0.34) 50%, transparent 50%);
  background-size:
    92px 92px,
    116px 116px,
    46px 46px,
    46px 46px;
  background-position:
    0 0,
    42px 16px,
    0 0,
    0 0;
  color: white;
  padding: 24px 0 30px;
  border-bottom: 5px solid #e8bd78;
  box-shadow: inset 0 -28px 45px rgba(67, 128, 125, 0.13);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  color: #203f40;
  text-shadow: 0 1px rgba(255, 249, 226, 0.75);
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 600;
  margin: 0;
}

.btn-logout {
  background: transparent;
  border: 1px solid rgba(32, 63, 64, 0.55);
  color: #203f40;
  padding: 9px 15px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 249, 226, 0.38);
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 42px 20px 64px;
}

.search-bar {
  display: flex;
  align-items: center;
  max-width: 620px;
  margin-bottom: 28px;
  padding: 0 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 3px;
  box-shadow: 0 4px 14px rgba(59, 44, 27, 0.05);
}

.search-icon {
  color: var(--coral);
  font-family: Georgia, serif;
  font-size: 27px;
  line-height: 1;
  transform: rotate(-20deg);
}

.search-bar input {
  min-width: 0;
  flex: 1;
  padding: 14px 10px;
  color: var(--ink);
  background: transparent;
  border: 0;
  outline: 0;
}

.search-bar input::placeholder {
  color: #9a9186;
}

.search-bar input::-webkit-search-cancel-button {
  display: none;
}

.clear-search {
  padding: 2px 5px;
  color: var(--muted);
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}

.clear-search:hover {
  color: var(--coral);
}

.tabs {
  display: flex;
  gap: 26px;
  margin-bottom: 34px;
  border-bottom: 1px solid var(--line);
}

.tab {
  background: none;
  border: none;
  padding: 11px 2px 13px;
  font-size: 16px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
  transition: all 0.3s;
}

.tab.active {
  color: var(--sage-dark);
  border-bottom-color: var(--coral);
}

.tab:hover {
  color: var(--sage-dark);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  font-size: 30px;
  color: var(--ink);
  margin: 0;
}

.btn-primary {
  background: var(--coral);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--sage-dark);
  padding: 8px 16px;
  border: 1px solid var(--line);
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f1ece4;
}

.btn-delete {
  background: #a94d3b;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #873e31;
}

.loading,
.empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
  font-size: 16px;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
  gap: 28px;
}

.recipe-card {
  background: var(--surface);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 5px 18px rgba(59, 44, 27, 0.06);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(59, 44, 27, 0.12);
}

.recipe-image {
  width: 100%;
  height: 218px;
  background-size: cover;
  background-position: center;
}

.recipe-image-placeholder {
  width: 100%;
  height: 200px;
  background: #e8e2d7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 14px;
}

.recipe-info {
  padding: 20px 21px 22px;
}

.recipe-info h3 {
  font-size: 23px;
  margin: 0 0 8px 0;
  color: var(--ink);
}

.author {
  font-size: 13px;
  color: var(--coral);
  margin: 0 0 8px 0;
}

.description {
  font-size: 13px;
  color: var(--muted);
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.recipe-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  font-size: 13px;
  color: var(--muted);
}

.icon {
  margin-right: 4px;
}

.recipe-actions {
  display: flex;
  gap: 8px;
  padding-bottom: 8px;
}

.recipe-actions a,
.recipe-actions button {
  flex: 1;
  text-align: center;
}

.recipe-actions .btn-secondary,
.recipe-actions .btn-delete {
  padding: 6px 9px;
  font-size: 12px;
}
</style>
