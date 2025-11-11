import { vi } from 'vitest'

export const makeVFormStub = (valid = true) => ({
  template: '<form><slot /></form>',
  setup(_props: unknown, { expose }: unknown) {
    const validate = vi.fn(async () => ({ valid }))
    const reset = vi.fn()
    const resetValidation = vi.fn()
    expose({ validate, reset, resetValidation })
    return {}
  },
})
