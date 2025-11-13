import type {
  Me,
  PersonalPayload,
  BankPayload,
  TaxPayload,
  MeResponse,
} from '~/types/me'

export function useMe() {
  const { data, pending, error, refresh } = useAsyncData<Me>(
    'me',
    () => $fetch('/api/me'),
    {
      server: false,
      lazy: false,
    },
  )

  const updateFromResponse = (res: MeResponse) => {
    const next = 'data' in res ? res.data : res
    data.value = { ...(data.value ?? {}), ...next }
  }

  const update = async (payload: Partial<Me>) => {
    const res = await $fetch<MeResponse>('/api/me', {
      method: 'PUT',
      body: payload,
    })
    updateFromResponse(res)
  }

  const updatePersonal = async (payload: PersonalPayload) => {
    const res = await $fetch<MeResponse>('/api/me', {
      method: 'PUT',
      body: payload,
    })
    updateFromResponse(res)
  }

  const updateBank = async (payload: BankPayload) => {
    const res = await $fetch<MeResponse>('/api/me', {
      method: 'PUT',
      body: payload,
    })
    updateFromResponse(res)
  }

  const updateTax = async (payload: TaxPayload) => {
    const res = await $fetch<MeResponse>('/api/me', {
      method: 'PUT',
      body: payload,
    })
    updateFromResponse(res)
  }

  return {
    data,
    pending,
    error,
    refresh,
    update,
    updatePersonal,
    updateBank,
    updateTax,
  }
}
