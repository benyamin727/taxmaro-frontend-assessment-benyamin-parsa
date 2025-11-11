<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface Tab {
  key: string;
  label: string;
}

defineProps<{
  modelValue: string;
  tabs: Tab[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function selectTab(key: string) {
  emit("update:modelValue", key);
}
</script>

<template>
  <div class="tabs">
    <button
      v-for="t in tabs"
      :key="t.key"
      class="tabs__item"
      :class="{ 'tabs__item--active': t.key === modelValue }"
      type="button"
      @click="selectTab(t.key)"
    >
      {{ t.label }}
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  background-color: #f0f2ef;
  border-radius: 9999px;
  padding: 6px;
  gap: 4px;
  width: 100%;
}

.tabs__item {
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 9999px;
  padding: 10px 0;
  background-color: transparent;
  color: #1c1c1c;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.tabs__item--active {
  background-color: #1c1c1c;
  color: #fff;
}
</style>
