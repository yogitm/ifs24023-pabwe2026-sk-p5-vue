<template>
  <div>
    <!-- Mobile Backdrop -->
    <div
      v-if="isSidebarOpen"
      data-testid="sidebar-backdrop"
      @click="$emit('close-mobile')"
      class="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
    />

    <aside
      class="fixed top-16 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 p-4 transition-transform duration-200 md:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col h-full justify-between">
        <div class="space-y-4">
          <p class="px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Menu Utama
          </p>
          <nav aria-label="Navigasi Utama" class="space-y-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :exact="item.exact"
              @click="$emit('close-mobile')"
              custom
              v-slot="{ href, navigate, isActive, isExactActive }"
            >
              <a
                :href="href"
                :aria-current="(item.exact ? isExactActive : isActive) ? 'page' : undefined"
                @click="navigate"
                class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="
                  (item.exact ? isExactActive : isActive)
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                "
              >
                <div class="flex items-center gap-3">
                  <component
                    :is="item.icon"
                    aria-hidden="true"
                    :size="18"
                    :class="
                      (item.exact ? isExactActive : isActive)
                        ? 'text-blue-600'
                        : 'text-slate-400'
                    "
                  />
                  <span>{{ item.label }}</span>
                </div>
                <ChevronRight
                  v-if="item.exact ? isExactActive : isActive"
                  aria-hidden="true"
                  :size="14"
                  class="text-blue-500"
                />
              </a>
            </RouterLink>
          </nav>
        </div>

        <div class="pt-3 border-t border-slate-100 px-3 text-xs text-slate-500 flex items-center justify-between">
          <span>Delcom Auction</span>
          <span>PABWE P5</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { Gavel, Users, UserCircle, ChevronRight } from "lucide-vue-next";

defineProps({
  isSidebarOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close-mobile"]);

const navItems = [
  {
    to: "/",
    label: "Dashboard Lelang",
    icon: Gavel,
    exact: true,
  },
  {
    to: "/users",
    label: "Daftar Pengguna",
    icon: Users,
    exact: false,
  },
  {
    to: "/profile",
    label: "Profil Saya",
    icon: UserCircle,
    exact: false,
  },
];
</script>
