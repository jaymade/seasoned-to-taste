import { fetchAuthSession } from "aws-amplify/auth";
import type { Recipe, RecipeFormData } from "../types";

const apiUrl = import.meta.env.VITE_API_URL;

const request = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  if (!apiUrl) throw new Error("VITE_API_URL is not configured");
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok)
    throw new Error((await response.json()).message ?? "Recipe request failed");
  return response.status === 204 ? (undefined as T) : response.json();
};

export const recipeService = {
  list: () => request<Recipe[]>("/recipes"),
  mine: () => request<Recipe[]>("/recipes/mine"),
  get: (id: string) => request<Recipe>(`/recipes/${id}`),
  create: (recipe: RecipeFormData) =>
    request<Recipe>("/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
    }),
  update: (id: string, recipe: RecipeFormData) =>
    request<Recipe>(`/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(recipe),
    }),
  remove: (id: string) => request<void>(`/recipes/${id}`, { method: "DELETE" }),
};
