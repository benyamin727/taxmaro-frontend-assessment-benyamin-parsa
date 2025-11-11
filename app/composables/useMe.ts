import type { Me, PersonalPayload, BankPayload, TaxPayload } from '~/types/me'

export function useMe() {
  const { data, pending, error, refresh } = useAsyncData<Me>('me', () => $fetch('/api/me'))

  const update = async (payload: Partial<Me>) => {
    await $fetch('/api/me', { method: 'PUT', body: payload })
    await refresh()
  }

  const updatePersonal = async (payload: PersonalPayload) => {
    await $fetch('/api/me', { method: 'PUT', body: payload })
    await refresh()
  }

  const updateBank = async (payload: BankPayload) => {
    await $fetch('/api/me', { method: 'PUT', body: payload })
    await refresh()
  }

  const updateTax = async (payload: TaxPayload) => {
    await $fetch('/api/me', { method: 'PUT', body: payload })
    await refresh()
  }

  return { data, pending, error, refresh, update, updatePersonal, updateBank, updateTax }
}
