<script setup lang="ts">
import {
  focusedItemStoreId,
  useItemStore,
  useNavbarItemStore,
} from "@/stores/items/manager";
import { getPathName, usePathStore } from "@/stores/path";
import { RootKey, roots } from "@/stores/settings/default";
import { clearDragOverStyle, setDragOverStyle } from "@/utils/style";
import { useSwipe } from "@vueuse/core";
import { computed, inject, ref, watch } from "vue";
import Chevron from "../Chevron.vue";
import CreateOrUpload from "./CreateOrUpload.vue";
import ExplorerNavbarDropdown from "./ExplorerNavbarDropdown.vue";
import ExplorerNavbarExplorer from "./ExplorerNavbarExplorer.vue";
import ExplorerNavbarInput from "./ExplorerNavbarInput.vue";
import ViewSelector from "./ViewSelector.vue";

const isThemeLight = inject<boolean>("isThemeLight")!;

const itemStore = useItemStore();
const navbarItemStore = useNavbarItemStore();
const pathStore = usePathStore();

const navbarPathDiv = ref<HTMLElement | null>(null);
const { isSwiping, direction } = useSwipe(navbarPathDiv);
watch(isSwiping, (isSwiping) => {
  if (isSwiping && direction.value == "left") {
    const parent = pathStore.folderPaths[pathStore.folderPaths.length - 2];
    parent && pathStore.pushOnTab(parent);
  }
});

const showPathInput = ref(false);
const showRootsDropdown = ref(false);
const explorerPath = ref("");

const folderPaths = computed(() =>
  pathStore.folderPaths.map((p, i) => ({
    path: p,
    isRoot: i == 0,
    isPrevExpanded: explorerPath.value == pathStore.folderPaths[i - 1],
  })),
);

watch(
  () => navbarItemStore.isOpen,
  (isOpen) => {
    if (!isOpen) explorerPath.value = "";
  },
);

const handlePathClick = (path: string) => {
  showRootsDropdown.value = false;
  pathStore.pushOnTab(path);
};
const openNavbarExplorer = (path: string, keepOpen?: boolean) => {
  if (explorerPath.value == path && !keepOpen) {
    navbarItemStore.isOpen = false;
    return;
  }
  explorerPath.value = path;
  navbarItemStore.isOpen = true;
  focusedItemStoreId.value = navbarItemStore.$id;
  if (!navbarItemStore.isOpen) return;
  navbarItemStore.path = path;
};
</script>

<template>
  <div
    class="z-20 flex flex-wrap gap-3 rounded-box border-b-8 lg:border-0"
    :class="{
      'border-b-base-200': isThemeLight,
      'border-b-base-100/25': !isThemeLight,
    }"
  >
    <div
      ref="navbarPathDiv"
      class="relative flex flex-1 cursor-pointer flex-wrap items-center rounded-btn text-xl"
      :class="{
        'bg-base-200 hover:bg-base-300': isThemeLight,
        'bg-base-300': isThemeLight && showPathInput,
        'bg-base-100/25 hover:bg-base-100/50': !isThemeLight,
        'bg-base-100/50': !isThemeLight && showPathInput,
      }"
      @click.self="showPathInput = true"
    >
      <ExplorerNavbarInput v-model:show-path-input="showPathInput" />
      <template
        v-if="!showPathInput"
        v-for="({ path, isRoot, isPrevExpanded }, i) in folderPaths"
      >
        <div
          v-if="!isRoot"
          class="flex items-center rounded-btn py-2 lg:relative"
          :class="{
            'hover:bg-base-100': isThemeLight,
            'hover:bg-base-300': !isThemeLight,
            'bg-base-100': isThemeLight && isPrevExpanded,
            'bg-base-300': !isThemeLight && isPrevExpanded,
          }"
          @click.self="openNavbarExplorer(pathStore.folderPaths[i - 1])"
          @dragover.self="
            openNavbarExplorer(pathStore.folderPaths[i - 1], true)
          "
        >
          <Chevron :is-expanded="isPrevExpanded" />
          <Transition name="slide-down">
            <ExplorerNavbarExplorer
              v-if="navbarItemStore.isOpen && isPrevExpanded"
              :path="explorerPath"
              :item-store="navbarItemStore"
            />
          </Transition>
        </div>
        <a
          :href="`/${path}`"
          class="nav-path relative flex items-center whitespace-pre rounded-btn py-2"
          :class="{
            'hover:bg-base-100': isThemeLight,
            'hover:bg-base-300': !isThemeLight,
          }"
          @drop.stop.prevent="itemStore.handleDrop($event, path)"
          @dragover.stop.prevent="setDragOverStyle"
          @dragleave.stop.prevent="clearDragOverStyle"
          @dragend.stop.prevent="clearDragOverStyle"
          @click.prevent="handlePathClick(path)"
          @mouseover="showRootsDropdown = isRoot"
          @mouseleave="showRootsDropdown = false"
          draggable="false"
          v-wave
        >
          <span
            v-if="isRoot"
            class="material-symbols-outlined pointer-events-none pl-2 !align-text-bottom"
          >
            {{ roots[path as RootKey]?.icon }}
          </span>
          {{ getPathName(path) }}
          <ExplorerNavbarDropdown v-if="isRoot" :show="showRootsDropdown" />
        </a>
      </template>
    </div>
    <div class="flex w-full gap-3 lg:w-auto">
      <ViewSelector />
      <CreateOrUpload class="ml-auto" />
    </div>
  </div>
</template>

<style scoped>
a.nav-path {
  transition:
    transform 300ms,
    border 300ms;
  border-width: 2px;
  border-color: transparent;
  white-space: pre;
  &.dragover {
    transform: scale(1.25);
    border: 2px dashed oklch(var(--bc));
    + span {
      visibility: hidden;
    }
  }
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-0.5rem) scale(0.75);
}
</style>
