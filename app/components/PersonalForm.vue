<script setup lang="ts">
import { reactive, ref } from "vue";
import { useMe } from "~/composables/useMe";
import {
  required,
  email,
  phoneLite,
  postalLite,
  minLen,
  combine,
} from "~/utils/validation";
import { getErrorMessage } from "~/utils/helper";
import { useToast } from "~/composables/useToast";
const {
  success: toastSuccess,
  error: toastError,
  loading,
  dismiss,
} = useToast();
const { data, updatePersonal } = useMe();
const valid = ref(false);
const saving = ref(false);
const success = ref(false);
const error = ref<string | null>(null);
const personalFormRef = ref();
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  zip: "",
  state: "",
  city: "",
  address: "",
  position: "",
  department: "",
});

watch(
  () => data.value,
  (d) => {
    if (!d) return;
    form.firstName = d.firstName ?? "";
    form.lastName = d.lastName ?? "";
    form.email = d.email ?? "";
    form.phone = d.phone ?? "";
    form.country = d.country ?? "";
    form.zip = d.zip ?? "";
    form.state = d.state ?? "";
    form.city = d.city ?? "";
    form.address = d.address ?? "";
    form.position = d.position ?? "";
    form.department = d.department ?? "";
  },
  { immediate: true },
);

const rules = {
  firstName: [combine(required, minLen(2))],
  lastName: [combine(required, minLen(2))],
  email: [combine(required, email)],
  phone: [combine(required, phoneLite)],
  position: [required],
  department: [],
  country: [required],
  zip: [combine(required, postalLite)],
  state: [required],
  city: [required],
  address: [combine(required, minLen(3))],
};

const onSubmit = async () => {
  if (!personalFormRef.value?.validate) return;
  const { valid: isValid } = await personalFormRef.value.validate();
  if (!isValid) {
    const msg = "Please correct the highlighted fields.";
    error.value = msg;
    toastError(msg);
    return;
  }

  saving.value = true;
  error.value = null;
  success.value = false;
  const tid = loading("Saving personal information...");
  try {
    await updatePersonal({ ...form });
    success.value = true;
    dismiss(tid);
    toastSuccess("Information saved successfully");
  } catch (err: unknown) {
    success.value = false;
    const msg = getErrorMessage(err);
    error.value = msg;
    dismiss(tid);
    toastError(msg);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <section class="personal">
    <v-form ref="personalFormRef" v-model="valid">
      <v-row>
        <v-col cols="12" md="6">
          <div class="personal__group">
            <h3 class="personal__group-title">General</h3>

            <v-text-field
              v-model="form.firstName"
              class="personal__field"
              data-test="firstName"
              label="First name"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.firstName"
            />
            <v-text-field
              v-model="form.lastName"
              class="personal__field"
              data-test="lastName"
              label="Last name"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.lastName"
            />
            <v-text-field
              v-model="form.email"
              class="personal__field"
              data-test="email"
              label="E-mail"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.email"
            />
            <v-text-field
              v-model="form.phone"
              class="personal__field"
              data-test="phone"
              label="Phone"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.phone"
            />
            <v-text-field
              v-model="form.position"
              class="personal__field"
              data-test="position"
              label="Position"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.position"
            />
            <v-text-field
              v-model="form.department"
              class="personal__field"
              data-test="department"
              label="Department (optional)"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.department"
            />
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="personal__group">
            <h3 class="personal__group-title">Address</h3>

            <v-text-field
              v-model="form.country"
              class="personal__field"
              label="Country"
              data-test="country"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.country"
            />
            <v-text-field
              v-model="form.zip"
              class="personal__field"
              data-test="zip"
              label="Postcode"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.zip"
            />
            <v-text-field
              v-model="form.state"
              class="personal__field"
              data-test="state"
              label="State"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.state"
            />
            <v-text-field
              v-model="form.city"
              class="personal__field"
              data-test="city"
              label="City"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.city"
            />
            <v-text-field
              v-model="form.address"
              class="personal__field"
              data-test="address"
              label="Street / Address"
              variant="outlined"
              density="comfortable"
              :loading="saving"
              :rules="rules.address"
            />
          </div>
        </v-col>
      </v-row>

      <div class="personal__actions">
        <v-btn
          data-test="save-btn"
          class="personal__save"
          color="primary"
          block
          :loading="saving"
          @click="onSubmit"
        >
          Save
        </v-btn>
      </div>
    </v-form>
  </section>
</template>

<style scoped lang="scss">
.personal {
  display: block;

  &__group {
    padding: 16px;
    background: #fff;

    & + & {
      margin-top: 16px;
    }
  }

  &__group-title {
    margin: 0 0 12px;
    font-size: 1.1rem;
    font-weight: 700;
    color: #3b3b3b;
  }

  &__field {
    margin-bottom: 12px;
  }

  &__actions {
    display: flex;
    justify-content: center;
    padding-top: 16px;
  }

  &__save {
    max-width: 220px;
    background: #1c1c1c !important;
    color: #fff !important;
  }
}
</style>
