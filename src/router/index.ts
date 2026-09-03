import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/authStore";

import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import RecipeDetailView from "../views/RecipeDetailView.vue";
import RecipeFormView from "../views/RecipeFormView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/recipe/new",
    name: "recipe-new",
    component: RecipeFormView,
    meta: { requiresAuth: true },
  },
  {
    path: "/recipe/:id",
    name: "recipe-detail",
    component: RecipeDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: "/recipe/:id/edit",
    name: "recipe-edit",
    component: RecipeFormView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && authStore.isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
