/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { vi } from 'vitest'
import { ref } from 'vue'

vi.stubGlobal('$fetch', vi.fn())

vi.stubGlobal('useAsyncData', vi.fn((_key: string, fetcher: unknown) => {
  const data = ref<unknown>(null)
  const pending = ref(false)
  const error = ref<unknown>(null)

  const refresh = async () => {
    try {
      pending.value = true
      data.value = await fetcher()
    } catch (err) {
      error.value = err
    } finally {
      pending.value = false
    }
  }

  refresh()

  return { data, pending, error, refresh }
}))
vi.mock('#imports', () => ({
  useAsyncData: (globalThis as unknown).useAsyncData,
  useRoute: () => ({ path: '/', params: {}, query: {} }),
  useRuntimeConfig: () => ({}),
}))

vi.mock('#app', () => ({
  useAsyncData: (globalThis as unknown).useAsyncData,
}))
vi.mock('vuetify/components', async (orig) => (await orig))
