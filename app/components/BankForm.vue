<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
import { useMe } from "~/composables/useMe";
import {
  required,
  ibanLite,
  bicLite,
  minLen,
  combine,
} from "~/utils/validation";
import { getErrorMessage } from "~/utils/helper";
import { useToast } from "~/composables/useToast";
const { data, updateBank } = useMe();
const {
  success: toastSuccess,
  error: toastError,
  loading,
  dismiss,
} = useToast();
const formRef = ref();
const valid = ref(false);
const saving = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  payee: "",
  paymentMethod: "",
  bankName: "",
  bankBic: "",
  iban: "",
  id: "",
  bankId: "",
});

watchEffect(() => {
  const d = data.value;
  if (!d) return;
  form.payee = d.bankDetail?.payee ?? "";
  form.paymentMethod = d.bankDetail?.paymentMethod ?? "";
  form.bankName = d.bankDetail?.bankName ?? "";
  form.bankBic = d.bankDetail?.bankBic ?? "";
  form.iban = d.bankDetail?.iban ?? "";
  form.id = d.bankDetail?.id ?? "";
  form.bankId = d.bankDetail?.bankId ?? "";
});

const rules = {
  payee: [combine(required, minLen(2))],
  paymentMethod: [required],
  bankName: [required],
  bankBic: [combine(required, bicLite)],
  iban: [combine(required, (v: string) => ibanLite(v.replaceAll(" ", "")))],
  id: [required],
  bankId: [required],
};

async function onSubmit() {
  if (!formRef.value?.validate) return;
  const { valid: isValid } = await formRef.value.validate();
  if (!isValid) {
    const msg = "Please correct the highlighted fields.";
    error.value = msg;
    toastError(msg);
    return;
  }
  error.value = null;
  success.value = false;
  saving.value = true;
  const tid = loading("Saving bank details...");
  try {
    await updateBank({
      bankDetail: {
        payee: form.payee,
        paymentMethod: form.paymentMethod,
        bankName: form.bankName,
        bankBic: form.bankBic?.toUpperCase().trim(),
        iban: form.iban.replaceAll(" ", "").trim(),
        id: form.id,
        bankId: form.bankId,
      },
    });
    success.value = true;
    dismiss(tid);
    toastSuccess("Bank data saved successfully");
  } catch (err) {
    const msg = getErrorMessage(err);
    error.value = msg;
    dismiss(tid);
    toastError(msg);
  } finally {
    saving.value = false;
  }
}

const paymentOptions = [
  { title: "Cash", value: "cash" },
  { title: "Bank Transfer", value: "bank_transfer" },
  { title: "Cheque", value: "cheque" },
];
</script>

<template>
  <section class="bank">
    <v-form ref="formRef" v-model="valid">
      <v-row>
        <v-col cols="12">
          <div class="bank__group">
            <v-text-field
              v-model="form.payee"
              label="Payee"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.payee"
              class="mb-6"
            />

            <div class="text-subtitle-2 mb-2">Payment method</div>
            <v-radio-group
              v-model="form.paymentMethod"
              :rules="rules.paymentMethod"
              class="mb-6"
            >
              <v-radio
                v-for="opt in paymentOptions"
                :key="opt.value"
                :label="opt.title"
                :value="opt.value"
                :loading="saving"
              />
            </v-radio-group>

            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.bankName"
                  label="Bank name"
                  variant="outlined"
                  density="comfortable"
                  :loading="saving"
                  :rules="rules.bankName"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.bankBic"
                  label="BIC"
                  variant="outlined"
                  density="comfortable"
                  :rules="rules.bankBic"
                  :loading="saving"
                  placeholder="e.g. NTSBDEB1XXX"
                />
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="form.iban"
                  label="IBAN"
                  variant="outlined"
                  density="comfortable"
                  :rules="rules.iban"
                  :loading="saving"
                  placeholder="DE44 1234 1234 1234 1234 12"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="form.id"
                  label="ID"
                  variant="outlined"
                  density="comfortable"
                  :loading="saving"
                  :rules="rules.id"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  v-model="form.bankId"
                  label="Bank ID"
                  variant="outlined"
                  density="comfortable"
                  :loading="saving"
                  :rules="rules.bankId"
                />
              </v-col>
            </v-row>

            <div class="bank__actions mt-6">
              <v-btn
                data-test="save-btn"
                class="bank__save"
                color="primary"
                block
                :loading="saving"
                @click="onSubmit"
              >
                Save
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </section>
</template>

<style scoped>
.bank__group {
  padding: 16px;
  background: #fff;
}
.bank__actions {
  display: flex;
  justify-content: center;
}
.bank__save {
  max-width: 220px;
  background: #1c1c1c !important;
  color: #fff !important;
}
</style>
