<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200">
    <div class="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <button
          type="button"
          data-testid="toggle-sidebar-btn"
          @click="$emit('toggle-sidebar')"
          class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Toggle Navigation"
        >
          <X v-if="isSidebarOpen" :size="20" />
          <Menu v-else :size="20" />
        </button>

        <RouterLink to="/" class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Gavel :size="20" />
          </div>
          <span class="text-base sm:text-lg font-bold text-slate-900">
            Delcom Auction
          </span>
        </RouterLink>
      </div>

      <!-- Profile User Dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          type="button"
          data-testid="profile-dropdown-button"
          @click="dropdownOpen = !dropdownOpen"
          class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <img
            v-if="userProfile?.photo"
            :src="userProfile.photo"
            :alt="userProfile.name"
            class="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div
            v-else
            class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs"
          >
            {{ userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "U" }}
          </div>

          <div class="hidden sm:flex flex-col text-left">
            <span class="text-xs font-semibold text-slate-800 leading-tight">
              {{ userProfile?.name || "Pengguna" }}
            </span>
            <span class="text-[11px] text-slate-500 leading-tight">
              {{ userProfile?.email || "" }}
            </span>
          </div>
          <ChevronDown
            :size="14"
            class="text-slate-400 transition-transform duration-200"
            :class="{ 'rotate-180': dropdownOpen }"
          />
        </button>

        <div
          v-if="dropdownOpen"
          data-testid="profile-dropdown-menu"
          class="absolute right-0 mt-2 w-52 rounded-lg bg-white p-1.5 shadow-lg border border-slate-200 divide-y divide-slate-100 z-50"
        >
          <div class="px-3 py-2 sm:hidden">
            <p class="text-sm font-semibold text-slate-800">{{ userProfile?.name || "Pengguna" }}</p>
            <p class="text-xs text-slate-500 truncate">{{ userProfile?.email }}</p>
          </div>

          <div class="py-1">
            <button
              type="button"
              data-testid="dropdown-profile-link"
              @click="handleProfileClick"
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 transition-colors text-left"
            >
              <User :size="16" class="text-slate-500" />
              Profil Saya
            </button>
          </div>

          <div class="pt-1">
            <button
              type="button"
              data-testid="dropdown-logout-button"
              @click="handleLogoutClick"
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors text-left"
            >
              <LogOut :size="16" class="text-red-500" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, RouterLink } from "vue-router";
import {
  Gavel,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
} from "lucide-vue-next";
import { useAuthStore } from "../../auth/states/authStore";
import { useUsersStore } from "../../users/states/usersStore";

const props = defineProps({
  profile: {
    type: Object,
    default: null,
  },
  isSidebarOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-sidebar", "logout"]);

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

const userProfile = computed(() => props.profile || usersStore.profile);
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

function handleProfileClick() {
  dropdownOpen.value = false;
  router.push("/profile");
}

function handleLogoutClick() {
  dropdownOpen.value = false;
  emit("logout");
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
