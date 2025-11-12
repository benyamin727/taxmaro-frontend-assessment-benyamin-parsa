<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseTabs from "~/components/ui/BaseTabs.vue";
import PersonalForm from "~/components/PersonalForm.vue";
import BankForm from "~/components/BankForm.vue";
import TaxForm from "~/components/TaxForm.vue";
const route = useRoute();
const router = useRouter();

useHead({
  title: "Personal Settings",
});
const tabList = [
  { key: "personal", label: "Personal" },
  { key: "bank-data", label: "Bank Data" },
  { key: "tax-data", label: "Tax Data" },
];

if (!tabList.some((t) => t.key === route.params.tab)) {
  router.replace("/personal-data/personal");
}
const currentTab = computed(() =>
  tabList.find((t) => t.key === route.params.tab)
);
const currentComp = computed(() =>
  current.value === "personal"
    ? PersonalForm
    : current.value === "bank-data"
    ? BankForm
    : TaxForm
);
const current = computed({
  get: () => String(route.params.tab || "personal"),
  set: (val: string) => router.replace(`/personal-data/${val}`),
});
</script>

<template>
  <div class="tab-container">
    <h2 class="tab-container__title">{{ currentTab?.label }}</h2>

    <div class="tab-container__tabs">
      <BaseTabs v-model="current" :tabs="tabList" />
    </div>

    <div class="tab-container__content">
      <component :is="currentComp" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

.tab-container__title {
  font-weight: 800;
  font-size: 32px;
}

.tab-container__tabs {
  display: flex;
  justify-content: center;
}

.tab-container__content {
  margin-top: 16px;
}
</style>
