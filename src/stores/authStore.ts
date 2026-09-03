import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "../types";
import {
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";
import { awsAuthConfigured } from "../config/amplify";

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
    if (awsAuthConfigured) {
      await signIn({ username: email, password: _password });
      return restoreSession();
    }
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
    if (awsAuthConfigured) {
      await signUp({
        username: email,
        password: _password,
        options: { userAttributes: { email, name } },
      });
      return login(email, _password);
    }
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
    if (awsAuthConfigured) void signOut();
    setUser(null);
    setToken(null);
  };

  const restoreSession = () => {
    if (awsAuthConfigured) {
      return getCurrentUser()
        .then(async (currentUser) => {
          const session = await fetchAuthSession();
          setToken(session.tokens?.idToken?.toString() ?? null);
          const restoredUser: User = {
            id: currentUser.userId,
            email: currentUser.signInDetails?.loginId ?? "",
            name: currentUser.username,
            createdAt: new Date().toISOString(),
          };
          setUser(restoredUser);
          return restoredUser;
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          return null;
        });
    }
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
