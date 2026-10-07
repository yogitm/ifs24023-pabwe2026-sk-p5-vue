<template>
  <main role="main" class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center text-white shadow-xs mb-3">
        <Gavel :size="24" />
      </div>
      <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
        Delcom Auction
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Sistem Informasi Lelang Online
      </p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-xl border border-slate-200">
        <!-- Tabs -->
        <nav aria-label="Navigasi Autentikasi" class="flex rounded-lg bg-slate-100 p-1 mb-6">
          <RouterLink
            to="/auth/login"
            class="flex-1 py-2 text-center text-sm font-semibold rounded-md transition-colors"
            :class="isLoginActive ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            :aria-current="isLoginActive ? 'page' : undefined"
          >
            Masuk Akun
          </RouterLink>
          <RouterLink
            to="/auth/register"
            class="flex-1 py-2 text-center text-sm font-semibold rounded-md transition-colors"
            :class="!isLoginActive ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            :aria-current="!isLoginActive ? 'page' : undefined"
          >
            Daftar Baru
          </RouterLink>
        </nav>

        <RouterView />
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router";
import { Gavel } from "lucide-vue-next";
import { useUsersStore } from "../../users/states/usersStore";
import apiHelper from "../../../helpers/apiHelper";

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const isLoginActive = computed(() => route.path === "/auth/login");

onMounted(() => {
  const authToken = apiHelper.getAccessToken();
  if (authToken) {
    usersStore.asyncSetProfile();
  }
});

watch(
  () => [usersStore.isProfile, usersStore.profile],
  ([isProfile, profile]) => {
    if (isProfile) {
      usersStore.setIsProfile(false);
      if (profile) {
        router.push("/");
      }
    }
  }
);
</script>
