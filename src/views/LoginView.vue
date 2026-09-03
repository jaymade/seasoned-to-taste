<template>
  <div class="login-container">
    <div class="login-intro">
      <p class="eyebrow">A recipe journal for good things</p>
      <h1>Seasoned<br /><em>to Taste</em></h1>
      <p class="intro-copy">Gather the recipes worth passing down.</p>
      <div class="intro-rule"><span>✦</span></div>
      <p class="edition">Volume 01 · The family table</p>
    </div>

    <div class="login-card">
      <div class="card-kicker">Welcome to the kitchen</div>
      <h2>{{ isLogin ? "Open your recipe box" : "Start your recipe box" }}</h2>
      <p class="tagline">
        {{
          isLogin
            ? "Your favorite recipes are waiting."
            : "Make a place for recipes worth keeping."
        }}
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label for="name">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            placeholder="Your Name"
            required
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ isLogin ? "Login" : "Register" }}
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>

      <div class="toggle-auth">
        <p v-if="isLogin">
          Don't have an account?
          <button type="button" @click="toggleMode" class="link-btn">
            Register here
          </button>
        </p>
        <p v-else>
          Already have an account?
          <button type="button" @click="toggleMode" class="link-btn">
            Login here
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);
const error = ref("");

const form = ref({
  email: "",
  password: "",
  name: "",
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = "";
  form.value = { email: "", password: "", name: "" };
};

const handleSubmit = async () => {
  error.value = "";
  loading.value = true;

  try {
    if (isLogin.value) {
      await authStore.login(form.value.email, form.value.password);
    } else {
      await authStore.register(
        form.value.email,
        form.value.password,
        form.value.name,
      );
    }

    router.push("/dashboard");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Authentication failed";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  gap: 8vw;
  background:
    radial-gradient(
      circle at 15% 15%,
      rgba(255, 255, 255, 0.8),
      transparent 28%
    ),
    linear-gradient(120deg, #f5e8dd 0%, #f7f4ee 48%, #e8eee4 100%);
  padding: 7vw 10vw;
  overflow: hidden;
}

.login-intro {
  position: relative;
  flex: 1;
  max-width: 570px;
  padding: 24px 0 24px 5vw;
}

.login-intro::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 100%;
  background: var(--coral);
  opacity: 0.6;
}

.eyebrow,
.card-kicker,
.edition {
  color: var(--coral);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.login-intro h1 {
  color: var(--sage-dark);
  font-size: clamp(58px, 8vw, 108px);
  line-height: 0.88;
  letter-spacing: -3px;
  margin: 28px 0;
}

.login-intro h1 em {
  color: var(--coral);
  font-weight: 500;
}

.intro-copy {
  color: var(--muted);
  font-size: 18px;
  max-width: 250px;
}

.intro-rule {
  color: var(--gold);
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 30px 0 18px;
}

.intro-rule::before,
.intro-rule::after {
  content: "";
  height: 1px;
  width: 48px;
  background: var(--gold);
}

.login-card {
  position: relative;
  background: var(--surface);
  padding: 45px;
  border: 1px solid var(--line);
  border-radius: 3px;
  box-shadow: 12px 14px 0 rgba(201, 103, 77, 0.12);
  max-width: 430px;
  width: 100%;
}

.card-kicker {
  margin-bottom: 16px;
}

.login-card h2 {
  font-size: 32px;
  line-height: 1.05;
  margin-bottom: 10px;
}

.tagline {
  color: var(--muted);
  margin-bottom: 30px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--ink);
  font-weight: 500;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 2px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgba(80, 97, 77, 0.12);
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: var(--sage-dark);
  color: white;
  border: none;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(53, 73, 52, 0.25);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #a94d3b;
  font-size: 14px;
  margin-top: 15px;
  text-align: center;
}

.toggle-auth {
  text-align: center;
  margin-top: 20px;
  color: var(--muted);
  font-size: 14px;
}

.link-btn {
  background: none;
  border: none;
  color: var(--coral);
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
  font-size: 14px;
}

.link-btn:hover {
  color: var(--sage-dark);
}

@media (max-width: 760px) {
  .login-container {
    flex-direction: column;
    justify-content: center;
    gap: 36px;
    padding: 48px 24px;
  }
  .login-intro {
    flex: none;
    padding: 0 0 0 24px;
    width: 100%;
  }
  .login-intro h1 {
    font-size: clamp(56px, 17vw, 84px);
    margin: 18px 0;
  }
  .intro-copy,
  .intro-rule,
  .edition {
    display: none;
  }
  .login-card {
    padding: 30px 24px;
  }
}
</style>
