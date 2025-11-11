// utils/validation.ts
export type Rule<T = string> = (value: T) => true | string

export const required: Rule<string> = (v) =>
  (v !== undefined && v !== null && String(v).trim().length > 0) || 'Required'

export const email: Rule<string> = (v) =>
  (!!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Invalid email'

export const maxLen = (n: number): Rule<string> => (v) =>
  (!v || String(v).length <= n) || `Max ${n} chars`

export const minLen = (n: number): Rule<string> => (v) =>
  (!!v && String(v).length >= n) || `Min ${n} chars`

export const postalLite: Rule<string> = (v) =>
  (!v || /^[A-Za-z0-9\- ]{3,10}$/.test(v)) || 'Invalid zip/postcode'

export const phoneLite: Rule<string> = (v) =>
  (!v || /^[0-9+()\-.\s]{6,20}$/.test(v)) || 'Invalid phone'

export const ibanLite: Rule<string> = (v) =>
  (!v || /^[A-Z]{2}[0-9A-Z]{12,32}$/.test(v.replaceAll(' ', ''))) || 'Invalid IBAN'

export const bicLite: Rule<string> = (v) =>
  (!v || /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(v)) || 'Invalid BIC'

export const optional = (rule: Rule): Rule => (v) =>
  (!v || String(v).trim() === '') ? true : rule(v)

export const combine = (...rules: Rule[]): Rule => (v) => {
  for (const r of rules) {
    const res = r(v)
    if (res !== true) return res
  }
  return true
}
