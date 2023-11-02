<script setup lang="ts">
import { useDialogStore } from "@/stores/dialog";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const store = useDialogStore();
const { state } = storeToRefs(store);
const dialogEl = ref<HTMLDialogElement | null>(null);

watch(
  () => state.value.isOpen,
  (isOpen) => {
    if (isOpen) dialogEl.value?.showModal();
    else dialogEl.value?.close();
  }
);
</script>

<template>
  <!-- Using empty click.stop to keep selected items selected -->
  <dialog
    ref="dialogEl"
    class="dsy-modal"
    @close="store.close"
    @click.stop="null"
  >
    <div class="dsy-modal-box">
      <div v-if="state.isError" class="dsy-alert dsy-alert-error">
        <span class="material-symbols-outlined"> cancel </span>
        <div class="max-w-full overflow-hidden break-words">
          {{ state.message }}
        </div>
      </div>
      <div v-else class="max-w-full overflow-hidden break-words">
        {{ state.message }}
      </div>
      <div class="dsy-modal-action">
        <form method="dialog">
          <template v-if="state.handleConfirmation">
            <button
              class="dsy-btn dsy-btn-primary"
              @click="state.handleConfirmation(true)"
            >
              Confirm
            </button>
            <button class="dsy-btn" @click="state.handleConfirmation(false)">
              Cancel
            </button>
          </template>
          <button v-else class="dsy-btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>