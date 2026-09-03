import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "../types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("authToken"));

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  const setToken = (newToken: string | null) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  const login = async (email: string, _password: string) => {
    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        createdAt: new Date().toISOString(),
      };
      const mockToken = "mock-token-" + Date.now();

      setUser(mockUser);
      setToken(mockToken);
      return mockUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (email: string, _password: string, name: string) => {
    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      const mockToken = "mock-token-" + Date.now();

      setUser(mockUser);
      setToken(mockToken);
      return mockUser;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const restoreSession = () => {
    if (token.value) {
      // TODO: Validate token with API and restore user info
      const mockUser: User = {
        id: "1",
        email: "user@example.com",
        name: "User",
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    login,
    register,
    logout,
    restoreSession,
  };
});
