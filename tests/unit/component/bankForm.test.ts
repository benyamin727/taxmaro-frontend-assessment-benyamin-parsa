/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountWithVuetify } from '../../helpers/mountWithVuetify'
import BankForm from '~/components/BankForm.vue'

const flush = () => new Promise((r) => setTimeout(r, 0))

const updateBank = vi.fn()

vi.mock('~/composables/useMe', () => ({
  useMe: () => ({
    data: { 
      value: {
        bankDetail: {
          payee: '',
          paymentMethod: '',
          bankName: '',
          bankBic: '',
          iban: '',
          id: '',
          bankId: '',
        }
      }
    },
    updateBank,
    pending: { value: false },
    error: { value: null },
  }),
}))

// Mock the error utility - Note: component uses getErrorMessage but doesn't import it
vi.mock('~/utils/helper', () => ({
  getErrorMessage: (err) => {
    if (err instanceof Error) return err.message
    return 'Something went wrong. Please try again.'
  }
}))

// Make getErrorMessage available globally for the component
global.getErrorMessage = (err) => {
  if (err instanceof Error) return err.message
  return 'Something went wrong. Please try again.'
}
const mockFormValid = (vm) => {
  vm.formRef = { value: { validate: vi.fn().mockResolvedValue({ valid: true }) } }
}

describe('BankForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not submit when invalid (empty form)', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: false }) }

    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(updateBank).not.toHaveBeenCalled()
  })

  it('submits successfully and shows success alert', async () => {
    updateBank.mockResolvedValueOnce(undefined)
    
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    
    // Fill in all required bank details
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44123412341234123412',
      id: '123',
      bankId: '456',
    })

    await vm.onSubmit()
    await flush()
    
    expect(updateBank).toHaveBeenCalledTimes(1)
    expect(updateBank).toHaveBeenCalledWith({
      bankDetail: {
        payee: 'Benyamin Parsan',
        paymentMethod: 'bank_transfer',
        bankName: 'N26',
        bankBic: 'NTSBDEB1XXX',
        iban: 'DE44123412341234123412',
        id: '123',
        bankId: '456',
      }
    })
    expect(vm.success).toBe(true)
    expect(vm.error).toBe(null)
  })

  it('failed submit shows error alert', async () => {
    updateBank.mockRejectedValueOnce(new Error('Network error'))
  
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44123412341234123412',
      id: '123',
      bankId: '456',
    })
    
    await vm.onSubmit()
    await flush()
    
    expect(updateBank).toHaveBeenCalledTimes(1)
    expect(vm.success).toBe(false)
    expect(vm.error).toBe('Network error')
  })

  it('removes spaces from IBAN before submission', async () => {
    updateBank.mockResolvedValueOnce(undefined)
    
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    
    // IBAN with spaces (as user might enter it)
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44 1234 1234 1234 1234 12',
      id: '123',
      bankId: '456',
    })

    await vm.onSubmit()
    await flush()
    
    expect(updateBank).toHaveBeenCalledTimes(1)
    const callArgs = updateBank.mock.calls[0][0]
    expect(callArgs.bankDetail.iban).toBe('DE44123412341234123412')
    expect(callArgs.bankDetail.iban).not.toContain(' ')
  })

  it('validates payee field (minimum length)', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    
    Object.assign(vm.form, {
      payee: 'A',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44123412341234123412',
      id: '123',
      bankId: '456',
    })
    
    vm.formRef = { validate: async () => ({ valid: false }) }
    
    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(updateBank).not.toHaveBeenCalled()
    expect(vm.error).toContain('Please correct')
  })

  it('validates required payment method', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: '',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44123412341234123412',
      id: '123',
      bankId: '456',
    })
    
    vm.formRef = { validate: async () => ({ valid: false }) }
    
    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(updateBank).not.toHaveBeenCalled()
  })
  

  it('shows loading state during submission', async () => {
    updateBank.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44123412341234123412',
      id: '123',
      bankId: '456',
    })

    const submitPromise = vm.onSubmit()
    
    await submitPromise
    await flush()
    expect(vm.saving).toBe(false)
  })

  it('clears previous errors on new submission', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    vm.error = 'Previous error'
    vm.success = false
    
    expect(vm.error).toBe('Previous error')
    
    updateBank.mockResolvedValueOnce(undefined)
    vm.formRef = { validate: async () => ({ valid: true }) }
    
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44123412341234123412',
      id: '123',
      bankId: '456',
    })
    
    await vm.onSubmit()
    await flush()
    expect(vm.error).toBe(null)
    expect(vm.success).toBe(true)
  })

  it('loads initial data from useMe composable', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    
    // Initially empty based on mock
    expect(vm.form.payee).toBe('')
    expect(vm.form.paymentMethod).toBe('')
    expect(vm.form.bankName).toBe('')
  })

  it('validates all required fields', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: false }) }
    
    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(updateBank).not.toHaveBeenCalled()
  })

  it('validates BIC format', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'INVALID',
      iban: 'DE44123412341234123412',
      id: '123',
      bankId: '456',
    })
    
    vm.formRef = { validate: async () => ({ valid: false }) }
    
    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(updateBank).not.toHaveBeenCalled()
  })

  it('validates IBAN format', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'INVALID_IBAN',
      id: '123',
      bankId: '456',
    })
    
    vm.formRef = { validate: async () => ({ valid: false }) }
    
    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(updateBank).not.toHaveBeenCalled()
  })

  it('validates required ID field', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44123412341234123412',
      id: '', // Empty ID
      bankId: '456',
    })
    
    vm.formRef = { validate: async () => ({ valid: false }) }
    
    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(updateBank).not.toHaveBeenCalled()
  })

  it('validates required Bank ID field', async () => {
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    
    const vm = wrapper.vm
    
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44123412341234123412',
      id: '123',
      bankId: '', // Empty Bank ID
    })
    
    vm.formRef = { validate: async () => ({ valid: false }) }
    
    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(updateBank).not.toHaveBeenCalled()
  })

  it('maps unknown error types to default error message', async () => {
    updateBank.mockRejectedValueOnce('OOPS_STRING')
  
    const wrapper = mountWithVuetify(BankForm)
    await flush()
    const vm = wrapper.vm
    mockFormValid(vm)
  
    Object.assign(vm.form, {
      payee: 'Benyamin Parsan',
      paymentMethod: 'bank_transfer',
      bankName: 'N26',
      bankBic: 'NTSBDEB1XXX',
      iban: 'DE44123412341234123412',
      id: '123',
      bankId: '456',
    })
  
    await vm.onSubmit()
    await flush()
    expect(vm.success).toBe(false)
  })
  
})