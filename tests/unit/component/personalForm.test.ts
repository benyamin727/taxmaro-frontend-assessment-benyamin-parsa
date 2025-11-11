/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountWithVuetify } from '../../helpers/mountWithVuetify'
import PersonalForm from '~/components/PersonalForm.vue'

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('PersonalForm (simple)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not submit when invalid (empty form)', async () => {
    ;(globalThis.$fetch as unknown).mockResolvedValueOnce({
      firstName: '', lastName: '', email: '', phone: '',
      address: '', city: '', state: '', zip: '', country: '',
      position: '', department: null,
      bankDetail: {}, tax: {}, insurance: {}
    })

    const wrapper = mountWithVuetify(PersonalForm)
    await flush()
    const vm = wrapper.vm
    vm.personalFormRef = { value: { validate: async () => ({ valid: false }) } }

    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    const calls = (globalThis.$fetch as unknown).mock.calls
    expect(calls.some((c: unknown[]) => c[0] === '/api/me' && c[1]?.method === 'PUT')).toBe(false)
  })

  
})
