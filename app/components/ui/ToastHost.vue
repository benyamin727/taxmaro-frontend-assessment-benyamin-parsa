<script setup lang="ts">
import { computed } from "vue";
import { useToast } from "~/composables/useToast";

const { toasts, dismiss, colorOf } = useToast();

const items = computed(() => [...toasts.value].reverse());
</script>

<template>
  <div
    class="fixed left-1/2 top-4 -translate-x-1/2 z-50 w-full max-w-[520px] px-3"
  >
    <transition-group name="slide-down" tag="div">
      <v-snackbar
        v-for="t in items"
        :key="t.id"
        :model-value="true"
        :timeout="t.timeout === 'persistent' ? -1 : t.timeout"
        :color="colorOf(t.kind)"
        variant="elevated"
        location="top"
        class="mb-2 shadow-lg"
        :class="`bg-${colorOf(t.kind)}`"
        data-test="toast-snackbar"
        @click="dismiss(t.id)"
      >
        <div class="flex items-center gap-3">
          <v-progress-circular
            v-if="t.kind === 'loading'"
            indeterminate
            size="18"
            width="2"
            data-test="toast-loading"
          />
          <span class="text-body-2">{{ t.text }}</span>
        </div>
      </v-snackbar>
    </transition-group>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.18s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
