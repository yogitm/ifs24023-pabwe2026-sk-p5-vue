<template>
  <div
    v-if="show"
    data-testid="edit-aucation-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="edit-modal-title"
    class="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-200 overflow-hidden"
  >
    <!-- Modal Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
          <Edit3 :size="18" :stroke-width="2.5" aria-hidden="true" />
        </div>
        <div>
          <h3 id="edit-modal-title" class="text-base font-bold text-slate-800">Ubah Data Lelang</h3>
          <p class="text-xs text-slate-500">Perbarui judul, harga awal, batas waktu, dan deskripsi lelang</p>
        </div>
      </div>
      <button
        type="button"
        data-testid="close-edit-modal-btn"
        @click="onClose"
        aria-label="Tutup modal ubah lelang"
        class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
      >
        <X :size="20" aria-hidden="true" />
      </button>
    </div>

    <!-- Modal Form Body -->
    <form @submit.prevent="handleSave" class="flex-1 flex flex-col min-h-0 bg-white">
      <div class="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label for="edit-aucation-title-input" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Judul Barang Lelang <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit-aucation-title-input"
              data-testid="edit-aucation-title-input"
              v-model="title"
              placeholder="Contoh: MacBook Pro M2 16 Inch"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm shadow-xs"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label for="edit-aucation-start-bid-input" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Harga Awal (Start Bid - Rp) <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              id="edit-aucation-start-bid-input"
              data-testid="edit-aucation-start-bid-input"
              v-model="startBid"
              placeholder="Contoh: 500000"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm shadow-xs"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label for="edit-aucation-closed-at-input" class="block text-sm font-semibold text-slate-700 mb-1.5">
              Batas Waktu Penutupan <span class="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="edit-aucation-closed-at-input"
              data-testid="edit-aucation-closed-at-input"
              v-model="closedAt"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm shadow-xs"
              required
              aria-required="true"
            />
          </div>
        </div>

        <div class="flex-1 flex flex-col min-h-[300px]">
          <label class="block text-sm font-semibold text-slate-700 mb-1.5 shrink-0">
            Deskripsi Barang (Markdown) <span class="text-red-500">*</span>
          </label>
          <div class="flex-1 min-h-[260px]">
            <MarkdownEditor
              v-model="description"
              placeholder="Tuliskan spesifikasi, kelengkapan, dan kondisi barang dalam format Markdown..."
              height="100%"
              textarea-test-id="edit-aucation-description-input"
            />
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/80 shrink-0">
        <button
          type="button"
          data-testid="cancel-edit-modal-btn"
          @click="onClose"
          :disabled="loading"
          aria-label="Batal"
          class="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          data-testid="submit-edit-modal-btn"
          :disabled="loading"
          aria-label="Perbarui Lelang"
          class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-md shadow-amber-600/25 transition-all disabled:opacity-60"
        >
          <template v-if="loading">
            <Loader2 :size="18" class="animate-spin" aria-hidden="true" />
            <span>Menyimpan...</span>
          </template>
          <template v-else>
            <Edit3 :size="18" :stroke-width="2.5" aria-hidden="true" />
            <span>Perbarui Lelang</span>
          </template>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Edit3, X, Loader2 } from "lucide-vue-next";
import { useAucationsStore } from "../states/aucationsStore";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import MarkdownEditor from "../components/MarkdownEditor.vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  aucationId: {
    type: [Number, String],
    default: null,
  },
});

const emit = defineEmits(["close", "success"]);

const aucationsStore = useAucationsStore();

const title = ref("");
const startBid = ref("");
const closedAt = ref("");
const description = ref("");
const loading = ref(false);

function onClose() {
  emit("close");
}

function syncData() {
  if (aucationsStore.aucation && props.show) {
    title.value = aucationsStore.aucation.title || "";
    startBid.value = aucationsStore.aucation.start_bid ?? "";
    description.value = aucationsStore.aucation.description || "";
    if (aucationsStore.aucation.closed_at) {
      closedAt.value = aucationsStore.aucation.closed_at
        .replace(" ", "T")
        .substring(0, 16);
    } else {
      closedAt.value = "";
    }
  }
}

watch(
  () => [props.aucationId, props.show],
  ([newId, newShow]) => {
    if (newId && newShow) {
      aucationsStore.asyncSetAucationById(newId);
    }
  }
);

watch(
  () => [aucationsStore.aucation, props.show],
  () => {
    syncData();
  },
  { immediate: true, deep: true }
);

watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }
);

watch(
  () => aucationsStore.isAucationChanged,
  (isChanged) => {
    if (isChanged) {
      loading.value = false;
      aucationsStore.setIsAucationChanged(false);
      emit("success");
      onClose();
    }
  }
);

async function handleSave() {
  if (!title.value.trim()) {
    showErrorDialog("Judul lelang tidak boleh kosong!");
    return;
  }
  if (!startBid.value || Number(startBid.value) <= 0) {
    showErrorDialog("Harga awal lelang harus lebih dari 0!");
    return;
  }
  if (!closedAt.value) {
    showErrorDialog("Batas waktu penutupan lelang wajib diisi!");
    return;
  }
  if (!description.value.trim()) {
    showErrorDialog("Deskripsi lelang tidak boleh kosong!");
    return;
  }

  let formattedClosedAt = closedAt.value.replace("T", " ");
  if (formattedClosedAt.length === 16) {
    formattedClosedAt += ":00";
  }

  loading.value = true;
  try {
    await aucationsStore.asyncPutAucation(
      props.aucationId,
      title.value.trim(),
      description.value.trim(),
      Number(startBid.value),
      formattedClosedAt
    );
  } finally {
    loading.value = false;
  }
}
</script>
