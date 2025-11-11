// types/me.ts
import * as z from 'zod'

export const meSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  position: z.string().min(1),
  department: z.string().optional().nullable().default(null),

  bankDetail: z.object({
    bankName: z.string().min(1),
    bankBic: z.string().min(1),
    iban: z.string().min(1),
    id: z.string().min(1),
    bankId: z.string().min(1),
    paymentMethod: z.string().min(1),
    payee: z.string().min(1),
  }),

  tax: z.object({
    taxId: z.string().min(1),
    noTaxId: z.boolean().default(false),
    extraJob: z.string().min(1),
    disability: z.string().min(1),
    information: z.string().min(1),
    employmentStatus: z.string().min(1),
    secondSalary: z.string().min(1),
  }),

  insurance: z.object({
    ssn: z.string().min(1),
    noSsn: z.boolean(),
    birthCountry: z.string().min(1),
    birthName: z.string().min(1),
    healthInsuranceType: z.string().min(1),
    healthInsurance: z.string().min(1),
    desiredHealthInsuranceCompany: z.string().min(1),
    privateHealthInsuranceName: z.string().min(1),
    privateHealthInsuranceContribution: z.string().min(1),
    privateNursingInsuranceContribution: z.string().min(1),
    lastPrivateHealthInsurance: z.string().min(1),
    haveChildren: z.string().min(1),
    requestFromPensionInsurance: z.boolean(),
  }),
})

export type Me = z.infer<typeof meSchema>

export const personalSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
  position: z.string().min(1),
  department: z.string().optional().nullable(),
})

export type PersonalPayload = z.infer<typeof personalSchema>

export const bankSchema = z.object({
  bankDetail: meSchema.shape.bankDetail,
})
export type BankPayload = z.infer<typeof bankSchema>

export const taxSchema = z.object({
  tax: meSchema.shape.tax,
})
export type TaxPayload = z.infer<typeof taxSchema>

export const insuranceSchema = z.object({
  insurance: meSchema.shape.insurance,
})
export type InsurancePayload = z.infer<typeof insuranceSchema>
