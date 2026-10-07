<template>
  <div v-if="!profile || !aucation" class="flex flex-col items-center justify-center py-20">
    <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>

  <div v-else class="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
    <!-- Back Button & Action Buttons -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <RouterLink
        to="/"
        data-testid="back-to-aucations-link"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft :size="18" />
        Kembali ke Daftar Lelang
      </RouterLink>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Bid Button for active auctions -->
        <button
          v-if="!aucation.is_closed"
          type="button"
          data-testid="place-bid-btn"
          @click="showBidModal = true"
          aria-label="Ajukan Tawaran Lelang"
          class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/25 transition-all"
        >
          <Gavel :size="16" aria-hidden="true" />
          Ajukan Tawaran
        </button>

        <template v-if="canManage">
          <button
            type="button"
            data-testid="edit-cover-btn"
            @click="showCoverModal = true"
            aria-label="Ubah Cover Lelang"
            class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors"
          >
            <ImagePlus :size="16" aria-hidden="true" />
            Ubah Cover
          </button>
          <button
            type="button"
            data-testid="edit-detail-aucation-btn"
            @click="showEditModal = true"
            aria-label="Ubah Data Lelang"
            class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
          >
            <Edit3 :size="16" aria-hidden="true" />
            Ubah Data
          </button>
          <button
            type="button"
            data-testid="delete-detail-aucation-btn"
            @click="handleDelete"
            aria-label="Hapus Lelang"
            class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors"
          >
            <Trash2 :size="16" aria-hidden="true" />
            Hapus
          </button>
        </template>
      </div>
    </div>

    <!-- Main Detail Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Cover Image -->
      <div v-if="aucation.cover" class="relative w-full h-64 sm:h-80 bg-slate-900 overflow-hidden">
        <img
          :src="aucation.cover"
          :alt="`Cover lelang ${aucation.title}`"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      </div>

      <div class="p-6 sm:p-8 space-y-6">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span class="font-mono text-xs font-bold text-slate-400">
              #{{ aucation.id }}
            </span>
            <span
              v-if="aucation.is_closed"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
            >
              <CheckCircle2 :size="14" />
              Lelang Ditutup
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <Clock :size="14" />
              Sedang Berlangsung
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {{ aucation.title }}
          </h1>

          <!-- Price & Meta Information -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="text-xs text-slate-400 font-medium">Harga Awal</span>
              <p class="text-lg font-bold text-slate-800 mt-0.5">
                {{ formatRupiah(aucation.start_bid || 0) }}
              </p>
            </div>
            <div class="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span class="text-xs text-blue-500 font-medium">Penawaran Tertinggi</span>
              <p class="text-lg font-bold text-blue-700 mt-0.5">
                {{ formatRupiah(highestBid) }}
              </p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="text-xs text-slate-400 font-medium">Batas Waktu Penutupan</span>
              <p class="text-sm font-bold text-slate-700 mt-1">
                {{ formatDate(aucation.closed_at) }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
            <div class="flex items-center gap-1.5">
              <Calendar :size="14" class="shrink-0" />
              <span>Dibuat: <strong class="text-slate-500">{{ formatDate(aucation.created_at) }}</strong></span>
            </div>
            <div v-if="aucation.author" class="flex items-center gap-1.5">
              <User :size="14" class="shrink-0" />
              <span>Pelelang: <strong class="text-slate-500">{{ aucation.author.name }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Description Markdown Viewer -->
        <div>
          <h2 class="text-sm font-bold text-slate-700 mb-2">Deskripsi Barang:</h2>
          <div
            data-testid="aucation-detail-description"
            class="prose max-w-none text-slate-600 bg-slate-50/60 p-6 rounded-2xl border border-slate-100 leading-relaxed"
          >
            <MarkdownViewer v-if="aucation.description" :content="aucation.description" />
            <p v-else class="italic text-slate-400">Tidak ada deskripsi rinci untuk barang ini.</p>
          </div>
        </div>

        <!-- Bids History Section -->
        <div class="pt-4 border-t border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
              <Gavel :size="18" class="text-blue-600" />
              Riwayat Penawaran ({{ bidsList.length }})
            </h2>
          </div>

          <div v-if="bidsList.length === 0" class="text-center py-8 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-sm">
            Belum ada penawaran yang diajukan untuk lelang ini. Jadilah penawar pertama!
          </div>

          <div v-else class="overflow-x-auto rounded-2xl border border-slate-100">
            <table class="w-full text-left text-sm text-slate-600">
              <thead class="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th scope="col" class="px-4 py-3">Penawar</th>
                  <th scope="col" class="px-4 py-3">Nominal Tawaran</th>
                  <th scope="col" class="px-4 py-3 hidden sm:table-cell">Waktu</th>
                  <th scope="col" class="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="(bid, index) in bidsList"
                  :key="bid.id"
                  :data-testid="`bid-row-${bid.id}`"
                  class="hover:bg-slate-50/50"
                >
                  <td class="px-4 py-3 font-medium text-slate-800">
                    {{ bid.user?.name }}
                    <span
                      v-if="index === 0"
                      class="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700"
                    >
                      Tertinggi
                    </span>
                  </td>
                  <td class="px-4 py-3 font-bold text-emerald-600">
                    {{ formatRupiah(bid.bid) }}
                  </td>
                  <td class="px-4 py-3 hidden sm:table-cell text-xs text-slate-400">
                    {{ formatDate(bid.created_at) }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button
                      v-if="canCancelBid(bid)"
                      type="button"
                      :data-testid="`delete-bid-btn-${bid.id}`"
                      @click="handleCancelBid"
                      class="text-xs text-red-600 hover:text-red-700 hover:underline font-semibold"
                    >
                      Batalkan
                    </button>
                    <span v-else class="text-xs text-slate-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ChangeCoverModal
      :show="showCoverModal"
      :aucation="aucation"
      @close="showCoverModal = false"
      @success="loadDetail"
    />

    <ChangeModal
      :show="showEditModal"
      :aucation-id="aucation.id"
      @close="showEditModal = false"
      @success="loadDetail"
    />

    <BidModal
      :show="showBidModal"
      :aucation="aucation"
      @close="showBidModal = false"
      @success="loadDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import ChangeCoverModal from "../modals/ChangeCoverModal.vue";
import ChangeModal from "../modals/ChangeModal.vue";
import BidModal from "../modals/BidModal.vue";
import MarkdownViewer from "../components/MarkdownViewer.vue";
import { useAucationsStore } from "../states/aucationsStore";
import { useUsersStore } from "../../users/states/usersStore";
import { formatDate, formatRupiah, showConfirmDialog } from "../../../helpers/toolsHelper";
import {
  ArrowLeft,
  ImagePlus,
  Edit3,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Gavel,
  User,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const aucationsStore = useAucationsStore();
const usersStore = useUsersStore();

const aucationId = computed(() => route.params.aucationId || route.params.id);
const profile = computed(() => usersStore.profile);
const aucation = computed(() => aucationsStore.aucation);
const isAucation = computed(() => aucationsStore.isAucation);
const isAucationDeleted = computed(() => aucationsStore.isAucationDeleted);

const showCoverModal = ref(false);
const showEditModal = ref(false);
const showBidModal = ref(false);

const bidsList = computed(() => {
  if (!aucation.value || !aucation.value.bids) return [];
  // Sort bids descending by bid amount
  return [...aucation.value.bids].sort((a, b) => Number(b.bid) - Number(a.bid));
});

const highestBid = computed(() => {
  if (bidsList.value.length > 0) {
    return Number(bidsList.value[0].bid);
  }
  return Number(aucation.value?.start_bid || 0);
});

const canManage = computed(() => {
  if (!profile.value || !aucation.value) return false;
  if (profile.value.role === "admin") return true;
  return aucation.value.author?.id === profile.value.id;
});

function canCancelBid(bid) {
  if (!profile.value) return false;
  if (profile.value.role === "admin") return true;
  return bid.user?.id === profile.value.id;
}

function loadDetail() {
  if (aucationId.value) {
    aucationsStore.asyncSetAucationById(aucationId.value);
  }
}

onMounted(() => {
  loadDetail();
});

watch(aucationId, (newId) => {
  if (newId) {
    aucationsStore.asyncSetAucationById(newId);
  }
});

watch(
  () => [isAucation.value, aucation.value],
  ([isA, a]) => {
    if (isA) {
      aucationsStore.setIsAucation(false);
      if (!a) {
        router.push("/");
      }
    }
  }
);

watch(isAucationDeleted, (isDel) => {
  if (isDel) {
    aucationsStore.setIsAucationDeleted(false);
    router.push("/");
  }
});

async function handleDelete() {
  const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus lelang ini?");
  if (result.isConfirmed) {
    aucationsStore.asyncDeleteAucation(aucation.value.id);
  }
}

async function handleCancelBid() {
  const result = await showConfirmDialog("Apakah Anda yakin ingin membatalkan tawaran Anda?");
  if (result.isConfirmed) {
    aucationsStore.asyncDeleteBid(aucation.value.id);
  }
}
</script>
