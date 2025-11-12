<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
import { useMe } from "~/composables/useMe";
import { required, minLen, combine } from "~/utils/validation";
import { getErrorMessage } from "~/utils/helper";
import { useToast } from "~/composables/useToast";
const { data, update } = useMe();
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
  taxId: "",
  noTaxId: false,
  extraJob: "",
  disability: "",
  information: "",
  employmentStatus: "",
  secondSalary: "",

  ssn: "",
  noSsn: false,
  birthCountry: "",
  birthName: "",
  healthInsuranceType: "",
  healthInsurance: "",
  desiredHealthInsuranceCompany: "",
  privateHealthInsuranceName: "",
  privateHealthInsuranceContribution: "",
  privateNursingInsuranceContribution: "",
  lastPrivateHealthInsurance: "",
  haveChildren: "",
  requestFromPensionInsurance: false,
});

watchEffect(() => {
  const d = data.value;
  if (!d) return;
  form.taxId = d.tax.taxId == "0" ? "" : d.tax?.taxId ?? null;
  form.noTaxId = d.tax?.noTaxId ?? false;
  form.extraJob = d.tax?.extraJob ?? "";
  form.disability = d.tax?.disability ?? "";
  form.information = d.tax?.information ?? "";
  form.employmentStatus = d.tax?.employmentStatus ?? "";
  form.secondSalary = d.tax?.secondSalary ?? "";

  form.ssn = d.insurance?.ssn == "0" ? "" : d.insurance?.ssn ?? null;
  form.noSsn = d.insurance?.noSsn ?? false;
  form.birthCountry = d.insurance?.birthCountry ?? "";
  form.birthName = d.insurance?.birthName ?? "";
  form.healthInsuranceType = d.insurance?.healthInsuranceType ?? "";
  form.healthInsurance = d.insurance?.healthInsurance ?? "";
  form.desiredHealthInsuranceCompany =
    d.insurance?.desiredHealthInsuranceCompany ?? "";
  form.privateHealthInsuranceName =
    d.insurance?.privateHealthInsuranceName ?? "";
  form.privateHealthInsuranceContribution =
    d.insurance?.privateHealthInsuranceContribution ?? "";
  form.privateNursingInsuranceContribution =
    d.insurance?.privateNursingInsuranceContribution ?? "";
  form.lastPrivateHealthInsurance =
    d.insurance?.lastPrivateHealthInsurance ?? "";
  form.haveChildren = d.insurance?.haveChildren ?? "";
  form.requestFromPensionInsurance =
    d.insurance?.requestFromPensionInsurance ?? false;
});

const taxIdRule = (v: string) => (form.noTaxId ? true : required(v));
const ssnRule = (v: string) => (form.noSsn ? true : required(v));

const rules = {
  taxId: [taxIdRule],
  extraJob: [required],
  disability: [required],
  information: [combine(required, minLen(2))],
  employmentStatus: [required],
  secondSalary: [required],

  ssn: [ssnRule],
  birthCountry: [required],
  birthName: [required],
  healthInsuranceType: [required],
  healthInsurance: [required],
  desiredHealthInsuranceCompany: [required],
  privateHealthInsuranceName: [required],
  privateHealthInsuranceContribution: [required],
  privateNursingInsuranceContribution: [required],
  lastPrivateHealthInsurance: [required],
  haveChildren: [required],
};

const yn = [
  { title: "Yes", value: "yes" },
  { title: "No", value: "no" },
];

const disabilityOptions = ["none", "<50%", ">=50%"];
const employmentOptions = [
  { title: "Full-time", value: "full-time" },
  { title: "Part-time", value: "part-time" },
  { title: "Working-student", value: "working-student" },
  { title: "Mini-job", value: "mini-job" },
  { title: "Freelance", value: "freelance" },
];

const hiTypeOptions = [
  { title: "Public", value: "public" },
  { title: "Private", value: "private" },
];

async function onSubmit() {
  if (!formRef.value?.validate) return;
  const { valid: isValid } = await formRef.value.validate();
  if (!isValid) {
    error.value = "Please correct the highlighted fields.";
    const msg = "Please correct the highlighted fields.";
    toastError(msg);
    return;
  }

  error.value = null;
  success.value = false;
  saving.value = true;
  const tid = loading("Saving Tax & Insurance data...");
  try {
    const tax = {
      noTaxId: form.noTaxId,
      extraJob: form.extraJob,
      disability: form.disability,
      information: form.information,
      employmentStatus: form.employmentStatus,
      secondSalary: form.secondSalary,
      taxId: form.noTaxId ? "0" : form.taxId,
    };

    const insurance = {
      noSsn: form.noSsn,
      birthCountry: form.birthCountry,
      birthName: form.birthName,
      healthInsuranceType: form.healthInsuranceType,
      healthInsurance: form.healthInsurance,
      desiredHealthInsuranceCompany: form.desiredHealthInsuranceCompany,
      privateHealthInsuranceName: form.privateHealthInsuranceName,
      privateHealthInsuranceContribution:
        form.privateHealthInsuranceContribution,
      privateNursingInsuranceContribution:
        form.privateNursingInsuranceContribution,
      lastPrivateHealthInsurance: form.lastPrivateHealthInsurance,
      haveChildren: form.haveChildren,
      requestFromPensionInsurance: form.requestFromPensionInsurance,
      ssn: form.noSsn ? "0" : form.ssn,
    };

    await update({ tax, insurance });
    success.value = true;
    dismiss(tid);
    toastSuccess("Tax and Insurance data saved successfully");
  } catch (err) {
    const msg = getErrorMessage(err);
    error.value = msg;
    dismiss(tid);
    toastError(msg);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <section>
    <v-form ref="formRef" v-model="valid">
      <v-row>
        <v-col cols="12" md="6">
          <div class="tax__group">
            <h3 class="tax__group-title">Tax details</h3>

            <v-switch
              v-model="form.noTaxId"
              inset
              color="primary"
              hide-details
              class="mb-2"
              :label="form.noTaxId ? 'No Tax ID' : 'Have Tax ID'"
            />
            <v-text-field
              v-model="form.taxId"
              :disabled="form.noTaxId"
              label="Tax ID"
              counter="11"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.taxId"
            />
            <v-select
              v-model="form.disability"
              :items="disabilityOptions"
              label="Degree of disability"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.disability"
            />
            <div class="text-subtitle-2 mt-4 mb-1">
              Do you have more than one employment?
            </div>
            <v-radio-group v-model="form.extraJob" :rules="rules.extraJob">
              <v-radio
                v-for="o in yn"
                :key="o.value"
                :label="o.title"
                :value="o.value"
              />
            </v-radio-group>
            <v-select
              v-model="form.employmentStatus"
              :items="employmentOptions"
              item-title="title"
              item-value="value"
              label="Employment status"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.employmentStatus"
            />
            <div class="text-subtitle-2 mt-4 mb-1">
              Do you have a second salary?
            </div>
            <v-radio-group
              v-model="form.secondSalary"
              :rules="rules.secondSalary"
            >
              <v-radio
                v-for="o in yn"
                :key="o.value"
                :label="o.title"
                :value="o.value"
              />
            </v-radio-group>
            <v-textarea
              v-model="form.information"
              label="Extra Tax or Employment information"
              rows="4"
              variant="outlined"
              :loading="saving"
              :rules="rules.information"
            />
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="tax__group">
            <h3 class="tax__group-title">Health insurance data</h3>

            <v-switch
              v-model="form.noSsn"
              inset
              color="primary"
              hide-details
              class="mb-2"
              :label="form.noSsn ? 'No SSN' : 'Have SSN'"
            />
            <v-text-field
              v-model="form.ssn"
              :disabled="form.noSsn"
              label="SSN"
              counter="12"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.ssn"
            />
            <v-text-field
              v-model="form.birthCountry"
              label="Place of birth"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.birthCountry"
            />
            <v-text-field
              v-model="form.birthName"
              label="Birth name"
              variant="outlined"
              :loading="saving"
              density="comfortable"
              :rules="rules.birthName"
            />

            <v-select
              v-model="form.healthInsuranceType"
              :items="hiTypeOptions"
              item-title="title"
              item-value="value"
              label="Health insurance type"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.healthInsuranceType"
            />
            <v-text-field
              v-model="form.healthInsurance"
              label="Health insurance"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.healthInsurance"
            />
            <v-text-field
              v-model="form.desiredHealthInsuranceCompany"
              label="Desired health insurance company"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.desiredHealthInsuranceCompany"
            />

            <v-text-field
              v-model="form.privateHealthInsuranceName"
              label="Private health insurance name"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.privateHealthInsuranceName"
            />
            <v-text-field
              v-model="form.privateHealthInsuranceContribution"
              label="Private health insurance contribution"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.privateHealthInsuranceContribution"
            />
            <v-text-field
              v-model="form.privateNursingInsuranceContribution"
              label="Private nursing insurance contribution"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.privateNursingInsuranceContribution"
            />
            <v-text-field
              v-model="form.lastPrivateHealthInsurance"
              label="Last private health insurance"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.lastPrivateHealthInsurance"
            />

            <div class="text-subtitle-2 mt-4 mb-1">Do you have children?</div>
            <v-radio-group
              v-model="form.haveChildren"
              :rules="rules.haveChildren"
            >
              <v-radio
                v-for="o in yn"
                :key="o.value"
                :label="o.title"
                :value="o.value"
              />
            </v-radio-group>

            <v-switch
              v-model="form.requestFromPensionInsurance"
              inset
              color="primary"
              hide-details
              class="mt-2"
              :loading="saving"
              label="Request from pension insurance"
            />
          </div>
        </v-col>
      </v-row>

      <div class="tax__actions mt-2">
        <v-btn
          data-test="save-btn"
          class="tax__save"
          block
          :loading="saving"
          @click="onSubmit"
          >SAVE</v-btn
        >
      </div>
    </v-form>
  </section>
</template>

<style scoped>
.tax__group {
  padding: 16px;
  background: #fff;
}
.tax__actions {
  display: flex;
  justify-content: center;
}
.tax__save {
  max-width: 220px;
  background: #1c1c1c !important;
  color: #fff !important;
}
.tax__group-title {
  margin: 0 0 12px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #3b3b3b;
}
</style>
