<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";

const authStore = useAuthStore();

onMounted(() => {
  authStore.restoreSession();
});
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>
