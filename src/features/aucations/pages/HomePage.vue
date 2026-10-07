<template>
  <div v-if="profile" class="space-y-8 animate-in fade-in duration-300">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Daftar Sesi Lelang
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Jelajahi dan ikuti sesi penawaran barang lelang berkualitas secara real-time.
        </p>
      </div>
      <button
        type="button"
        data-testid="add-aucation-btn"
        @click="showAddModal = true"
        aria-label="Tambah Sesi Lelang Baru"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-600/25 transition-all self-start sm:self-auto"
      >
        <Plus :size="18" :stroke-width="2.5" aria-hidden="true" />
        <span>Tambah Lelang</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Total Lelang
          </p>
          <h3 class="text-3xl font-black text-slate-800 mt-1">{{ totalCount }}</h3>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Gavel :size="26" :stroke-width="2" />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Lelang Berlangsung
          </p>
          <h3 class="text-3xl font-black text-emerald-600 mt-1">
            {{ activeCount }}
          </h3>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Clock :size="26" :stroke-width="2" />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Lelang Ditutup
          </p>
          <h3 class="text-3xl font-black text-slate-500 mt-1">{{ closedCount }}</h3>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
          <CheckCircle2 :size="26" :stroke-width="2" />
        </div>
      </div>
    </div>

    <!-- Table & Controls Section -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Filter Bar -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <label for="search-aucation-input" class="sr-only">Cari Sesi Lelang</label>
          <Search
            :size="18"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            id="search-aucation-input"
            data-testid="search-aucation-input"
            v-model="searchQuery"
            placeholder="Cari judul barang atau deskripsi..."
            aria-label="Cari judul barang atau deskripsi lelang"
            class="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Filter is_me -->
          <div class="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              data-testid="filter-all-aucations-btn"
              @click="isMeFilter = null"
              class="px-3 py-1.5 rounded-lg transition-all"
              :class="isMeFilter === null ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'"
            >
              Semua Lelang
            </button>
            <button
              type="button"
              data-testid="filter-my-aucations-btn"
              @click="isMeFilter = 1"
              class="px-3 py-1.5 rounded-lg transition-all"
              :class="isMeFilter === 1 ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'"
            >
              Lelang Saya
            </button>
          </div>

          <!-- Filter is_closed -->
          <div class="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              data-testid="filter-all-status-btn"
              @click="isClosedFilter = null"
              class="px-3 py-1.5 rounded-lg transition-all"
              :class="isClosedFilter === null ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'"
            >
              Semua Status
            </button>
            <button
              type="button"
              data-testid="filter-active-btn"
              @click="isClosedFilter = 0"
              class="px-3 py-1.5 rounded-lg transition-all"
              :class="isClosedFilter === 0 ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'"
            >
              Aktif
            </button>
            <button
              type="button"
              data-testid="filter-closed-btn"
              @click="isClosedFilter = 1"
              class="px-3 py-1.5 rounded-lg transition-all"
              :class="isClosedFilter === 1 ? 'bg-white text-slate-800 shadow-xs' : 'hover:text-slate-900'"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      <!-- Responsive Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100">
            <tr>
              <th scope="col" class="px-5 py-3.5 text-center w-16">ID</th>
              <th scope="col" class="px-5 py-3.5">Barang Lelang</th>
              <th scope="col" class="px-5 py-3.5">Harga Awal</th>
              <th scope="col" class="px-5 py-3.5 hidden md:table-cell">Batas Waktu</th>
              <th scope="col" class="px-5 py-3.5">Status</th>
              <th scope="col" class="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="loadingAucations && filteredAucations.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                <Loader2 :size="36" class="mx-auto text-blue-600 animate-spin mb-2" />
                <p class="font-medium text-slate-600">Memuat daftar lelang...</p>
              </td>
            </tr>
            <tr v-else-if="filteredAucations.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                <Gavel :size="40" class="mx-auto text-slate-400 mb-2" />
                <p class="font-medium text-slate-600">Belum ada sesi lelang yang sesuai kriteria.</p>
              </td>
            </tr>
            <tr
              v-else
              v-for="aucation in filteredAucations"
              :key="`aucation-${aucation.id}`"
              :data-testid="`aucation-row-${aucation.id}`"
              class="hover:bg-slate-50/70 transition-colors group"
            >
              <td class="px-5 py-4 text-center font-mono text-xs font-bold text-slate-500">
                #{{ aucation.id }}
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="aucation.cover"
                    :src="aucation.cover"
                    :alt="aucation.title"
                    class="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div
                    v-else
                    class="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0"
                  >
                    <Gavel :size="20" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800 leading-snug">
                      {{ aucation.title }}
                    </p>
                    <p v-if="aucation.author" class="text-xs text-slate-500 mt-0.5">
                      Oleh: {{ aucation.author.name }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 font-semibold text-slate-700">
                {{ formatRupiah(aucation.start_bid) }}
              </td>
              <td class="px-5 py-4 hidden md:table-cell text-xs text-slate-500">
                {{ formatDate(aucation.closed_at) }}
              </td>
              <td class="px-5 py-4">
                <span
                  v-if="aucation.is_closed"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Ditutup
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Berlangsung
                </span>
              </td>
              <td class="px-5 py-4 text-right">
                <div class="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    :data-testid="`view-aucation-${aucation.id}`"
                    @click="router.push(`/aucations/${aucation.id}`)"
                    class="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    :title="`Lihat detail lelang ${aucation.title}`"
                    :aria-label="`Lihat detail lelang ${aucation.title}`"
                  >
                    <Eye :size="18" aria-hidden="true" />
                  </button>
                  <button
                    v-if="canManage(aucation)"
                    type="button"
                    :data-testid="`edit-aucation-${aucation.id}`"
                    @click="handleEditAucation(aucation.id)"
                    class="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    :title="`Ubah lelang ${aucation.title}`"
                    :aria-label="`Ubah lelang ${aucation.title}`"
                  >
                    <Pencil :size="18" aria-hidden="true" />
                  </button>
                  <button
                    v-if="canManage(aucation)"
                    type="button"
                    :data-testid="`delete-aucation-${aucation.id}`"
                    @click="handleDeleteAucation(aucation.id)"
                    class="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    :title="`Hapus lelang ${aucation.title}`"
                    :aria-label="`Hapus lelang ${aucation.title}`"
                  >
                    <Trash2 :size="18" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <AddModal
      :show="showAddModal"
      @close="showAddModal = false"
      @success="loadAucations"
    />
    <ChangeModal
      :show="showChangeModal"
      :aucation-id="selectedAucationId"
      @close="showChangeModal = false"
      @success="loadAucations"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import AddModal from "../modals/AddModal.vue";
import ChangeModal from "../modals/ChangeModal.vue";
import { useAucationsStore } from "../states/aucationsStore";
import { useUsersStore } from "../../users/states/usersStore";
import { formatDate, formatRupiah, showConfirmDialog } from "../../../helpers/toolsHelper";
import {
  Plus,
  Gavel,
  CheckCircle2,
  Clock,
  Eye,
  Pencil,
  Trash2,
  Search,
  Loader2,
} from "lucide-vue-next";

const router = useRouter();
const aucationsStore = useAucationsStore();
const usersStore = useUsersStore();

const profile = computed(() => usersStore.profile);
const aucations = computed(() => aucationsStore.aucations);
const isAucationDeleted = computed(() => aucationsStore.isAucationDeleted);

const loadingAucations = ref(false);
const isMeFilter = ref(null);
const isClosedFilter = ref(null);
const searchQuery = ref("");
const showAddModal = ref(false);
const showChangeModal = ref(false);
const selectedAucationId = ref(null);

onMounted(() => {
  loadAucations();
});

function loadAucations() {
  loadingAucations.value = true;
  Promise.resolve(
    aucationsStore.asyncSetAucations(isMeFilter.value, isClosedFilter.value)
  ).finally(() => {
    loadingAucations.value = false;
  });
}

watch([isMeFilter, isClosedFilter], () => {
  loadAucations();
});

watch(isAucationDeleted, (deleted) => {
  if (deleted) {
    aucationsStore.setIsAucationDeleted(false);
    loadAucations();
  }
});

function canManage(aucation) {
  if (!profile.value) return false;
  if (profile.value.role === "admin") return true;
  return (
    aucation.author_id === profile.value.id ||
    aucation.user_id === profile.value.id ||
    (aucation.author && aucation.author.id === profile.value.id)
  );
}

function handleEditAucation(id) {
  selectedAucationId.value = id;
  showChangeModal.value = true;
}

async function handleDeleteAucation(id) {
  const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus sesi lelang ini?");
  if (result.isConfirmed) {
    aucationsStore.asyncDeleteAucation(id);
  }
}

const filteredAucations = computed(() => {
  return aucations.value.filter((aucation) => {
    if (!searchQuery.value.trim()) return true;
    const q = searchQuery.value.toLowerCase();
    const title = aucation.title ? aucation.title.toLowerCase() : "";
    const description = aucation.description ? aucation.description.toLowerCase() : "";
    return title.includes(q) || description.includes(q);
  });
});

const totalCount = computed(() => aucations.value.length);
const closedCount = computed(() => aucations.value.filter((a) => a.is_closed).length);
const activeCount = computed(() => totalCount.value - closedCount.value);
</script>
