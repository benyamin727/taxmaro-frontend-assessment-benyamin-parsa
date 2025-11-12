/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountWithVuetify } from '../../helpers/mountWithVuetify'
import PersonalForm from '~/components/PersonalForm.vue'

const flush = () => new Promise((r) => setTimeout(r, 0))

const updatePersonal = vi.fn()

vi.mock('~/composables/useMe', () => ({
  useMe: () => ({
    data: { value: {
      firstName: '', lastName: '', email: '', phone: '',
      address: '', city: '', state: '', zip: '', country: '',
      position: '', department: null,
    }},
    updatePersonal,
    pending: { value: false },
    error: { value: null },
  }),
}))

// Mock the error utility
vi.mock('~/utils/errors', () => ({
  getErrorMessage: (err) => {
    if (err instanceof Error) return err.message
    return 'Something went wrong. Please try again.'
  }
}))

describe('PersonalForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not submit when invalid (empty form)', async () => {
    const wrapper = mountWithVuetify(PersonalForm)
    await flush()
    
    const vm = wrapper.vm
    vm.personalFormRef = { validate: async () => ({ valid: false }) }

    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(updatePersonal).not.toHaveBeenCalled()
  })

  it('submits successfully and shows success alert', async () => {
    updatePersonal.mockResolvedValueOnce(undefined)
    
    const wrapper = mountWithVuetify(PersonalForm)
    await flush()
    
    const vm = wrapper.vm
    vm.personalFormRef = { validate: async () => ({ valid: true }) }
    Object.assign(vm.form, {
      firstName: 'Ben',
      lastName: 'Parsa',
      email: 'a@b.com',
      phone: '123456',
      address: 'Street 1',
      city: 'Essen',
      state: 'NRW',
      zip: '45127',
      country: 'DE',
      position: 'FE',
      department: '',
    })

    await vm.onSubmit()
    await flush()
    
    expect(updatePersonal).toHaveBeenCalledTimes(1)
    expect(updatePersonal).toHaveBeenCalledWith({
      firstName: 'Ben',
      lastName: 'Parsa',
      email: 'a@b.com',
      phone: '123456',
      address: 'Street 1',
      city: 'Essen',
      state: 'NRW',
      zip: '45127',
      country: 'DE',
      position: 'FE',
      department: '',
    })
    expect(vm.success).toBe(true)
    expect(vm.error).toBe(null)
  })

  it('failed submit shows error alert', async () => {
    updatePersonal.mockRejectedValueOnce(new Error('Boom'))
  
    const wrapper = mountWithVuetify(PersonalForm)
    await flush()
    
    const vm = wrapper.vm
    vm.personalFormRef = { validate: async () => ({ valid: true }) }
    Object.assign(vm.form, {
      firstName: 'B',
      lastName: 'P',
      email: 'a@b.com',
      phone: '123456',
      address: 'Main Street 1',
      city: 'Essen',
      state: 'NRW',
      zip: '45127',
      country: 'DE',
      position: 'FE',
      department: '',
    })

    await vm.onSubmit()
    await flush()
    
    expect(updatePersonal).toHaveBeenCalledTimes(1)
    expect(vm.success).toBe(false)
    expect(vm.error).toBe('Boom')
  })
})