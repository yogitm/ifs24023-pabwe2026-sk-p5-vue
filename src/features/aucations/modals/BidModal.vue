<template>
  <div
    v-if="show && aucation"
    data-testid="bid-modal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bid-modal-title"
      class="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Gavel :size="18" :stroke-width="2.5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="bid-modal-title" class="text-base font-bold text-slate-800">Ajukan Tawaran</h2>
            <p class="text-xs text-slate-500">Masukkan nominal penawaran lelang</p>
          </div>
        </div>
        <button
          type="button"
          data-testid="close-bid-modal-btn"
          aria-label="Tutup dialog penawaran"
          @click="onClose"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X :size="18" aria-hidden="true" />
        </button>
      </div>

      <!-- Body & Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Auction Info Card -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div class="text-xs font-medium text-slate-500">Barang Lelang:</div>
          <div class="text-sm font-bold text-slate-800 line-clamp-1">{{ aucation.title }}</div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <span class="text-slate-500">Harga Awal:</span>
            <span class="font-semibold text-slate-700">{{ formatRupiah(aucation.start_bid || 0) }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-500">Tawaran Tertinggi:</span>
            <span class="font-bold text-emerald-600">{{ formatRupiah(currentHighestBid) }}</span>
          </div>
        </div>

        <div>
          <label for="bid-amount-input" class="block text-sm font-semibold text-slate-700 mb-1.5">
            Nominal Tawaran Anda (Rp) <span class="text-red-500">*</span>
          </label>
          <input
            id="bid-amount-input"
            type="number"
            min="1000"
            step="1000"
            data-testid="bid-amount-input"
            v-model="bidAmount"
            :placeholder="`Minimal ${formatRupiah(minimumBid)}`"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-sm shadow-xs"
            required
            aria-required="true"
          />
          <p class="text-xs text-slate-500 mt-1.5">
            Tawaran harus minimal bernilai <span class="font-semibold text-emerald-700">{{ formatRupiah(minimumBid) }}</span>
          </p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            data-testid="cancel-bid-modal-btn"
            aria-label="Batal ajukan tawaran"
            @click="onClose"
            :disabled="loading"
            class="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            data-testid="submit-bid-modal-btn"
            aria-label="Kirim tawaran lelang"
            :disabled="loading"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/25 transition-all disabled:opacity-60"
          >
            <template v-if="loading">
              <Loader2 :size="18" class="animate-spin" />
              <span>Mengirim...</span>
            </template>
            <template v-else>
              <Gavel :size="18" :stroke-width="2.5" />
              <span>Kirim Tawaran</span>
            </template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Gavel, X, Loader2 } from "lucide-vue-next";
import { useAucationsStore } from "../states/aucationsStore";
import { showErrorDialog, formatRupiah } from "../../../helpers/toolsHelper";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  aucation: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "success"]);

const aucationsStore = useAucationsStore();

const bidAmount = ref("");
const loading = ref(false);

const currentHighestBid = computed(() => {
  if (!props.aucation) return 0;
  if (props.aucation.bids && props.aucation.bids.length > 0) {
    const highest = Math.max(...props.aucation.bids.map((b) => Number(b.bid || 0)));
    return Math.max(highest, Number(props.aucation.start_bid || 0));
  }
  return Number(props.aucation.start_bid || 0);
});

const minimumBid = computed(() => {
  return currentHighestBid.value > 0 ? currentHighestBid.value + 1000 : 1000;
});

function resetForm() {
  bidAmount.value = "";
}

function onClose() {
  resetForm();
  emit("close");
}

watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      resetForm();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }
);

watch(
  () => aucationsStore.isBidAdded,
  (isAdded) => {
    if (isAdded) {
      loading.value = false;
      aucationsStore.setIsBidAdded(false);
      resetForm();
      emit("success");
      onClose();
    }
  }
);

async function handleSubmit() {
  const numericBid = Number(bidAmount.value);
  if (!bidAmount.value || isNaN(numericBid) || numericBid <= 0) {
    showErrorDialog("Nominal tawaran harus berupa angka lebih dari 0!");
    return;
  }

  if (numericBid < minimumBid.value) {
    showErrorDialog(`Nominal tawaran minimal harus ${formatRupiah(minimumBid.value)}!`);
    return;
  }

  loading.value = true;
  try {
    await aucationsStore.asyncPostBid(props.aucation.id, numericBid);
  } finally {
    loading.value = false;
  }
}
</script>
