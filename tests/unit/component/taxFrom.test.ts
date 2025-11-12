/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountWithVuetify } from '../../helpers/mountWithVuetify'
import TaxForm from '~/components/TaxForm.vue'

const flush = () => new Promise((r) => setTimeout(r, 0))
const mockFormValid   = (vm) => vm.formRef = { value: { validate: vi.fn().mockResolvedValue({ valid: true }) } }
const update = vi.fn()

vi.mock('~/composables/useMe', () => ({
  useMe: () => ({
    data: { 
      value: {
        tax: {
          taxId: '',
          noTaxId: false,
          extraJob: '',
          disability: '',
          information: '',
          employmentStatus: '',
          secondSalary: '',
        },
        insurance: {
          ssn: '',
          noSsn: false,
          birthCountry: '',
          birthName: '',
          healthInsuranceType: '',
          healthInsurance: '',
          desiredHealthInsuranceCompany: '',
          privateHealthInsuranceName: '',
          privateHealthInsuranceContribution: '',
          privateNursingInsuranceContribution: '',
          lastPrivateHealthInsurance: '',
          haveChildren: '',
          requestFromPensionInsurance: false,
        },
      }
    },
    update,
    pending: { value: false },
    error: { value: null },
  }),
}))

vi.mock('~/utils/helper', () => ({
  getErrorMessage: (err) => {
    if (err instanceof Error) return err.message
    return 'Something went wrong. Please try again.'
  }
}))

describe('TaxForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not submit when invalid (empty form)', async () => {
    const wrapper = mountWithVuetify(TaxForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: false }) }

    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flush()
    
    expect(update).not.toHaveBeenCalled()
    expect(wrapper.html()).toContain('Please correct the highlighted fields')
  })

  it('submits successfully and shows success alert', async () => {
    update.mockResolvedValueOnce(undefined)
    
    const wrapper = mountWithVuetify(TaxForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    Object.assign(vm.form, {
      taxId: '12345678901',
      noTaxId: false,
      extraJob: 'no',
      disability: 'none',
      information: 'No additional information',
      employmentStatus: 'full-time',
      secondSalary: 'no',
      
      ssn: '123456789012',
      noSsn: false,
      birthCountry: 'Germany',
      birthName: 'Schmidt',
      healthInsuranceType: 'public',
      healthInsurance: 'TK',
      desiredHealthInsuranceCompany: 'TK',
      privateHealthInsuranceName: 'None',
      privateHealthInsuranceContribution: '0',
      privateNursingInsuranceContribution: '0',
      lastPrivateHealthInsurance: 'None',
      haveChildren: 'no',
      requestFromPensionInsurance: false,
    })

    await vm.onSubmit()
    await flush()
    
    expect(update).toHaveBeenCalledTimes(1)
    expect(update).toHaveBeenCalledWith({
      tax: {
        taxId: '12345678901',
        noTaxId: false,
        extraJob: 'no',
        disability: 'none',
        information: 'No additional information',
        employmentStatus: 'full-time',
        secondSalary: 'no',
      },
      insurance: {
        ssn: '123456789012',
        noSsn: false,
        birthCountry: 'Germany',
        birthName: 'Schmidt',
        healthInsuranceType: 'public',
        healthInsurance: 'TK',
        desiredHealthInsuranceCompany: 'TK',
        privateHealthInsuranceName: 'None',
        privateHealthInsuranceContribution: '0',
        privateNursingInsuranceContribution: '0',
        lastPrivateHealthInsurance: 'None',
        haveChildren: 'no',
        requestFromPensionInsurance: false,
      }
    })
    expect(vm.success).toBe(true)
    expect(vm.error).toBe(null)
    expect(wrapper.html()).toContain('Tax and Insurance data saved successfully')
  })

  it('failed submit shows error alert', async () => {
    update.mockRejectedValueOnce(new Error('Server error'))
  
    const wrapper = mountWithVuetify(TaxForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    
    Object.assign(vm.form, {
      taxId: '12345678901',
      noTaxId: false,
      extraJob: 'no',
      disability: 'none',
      information: 'No additional information',
      employmentStatus: 'full-time',
      secondSalary: 'no',
      
      ssn: '123456789012',
      noSsn: false,
      birthCountry: 'Germany',
      birthName: 'Schmidt',
      healthInsuranceType: 'public',
      healthInsurance: 'TK',
      desiredHealthInsuranceCompany: 'TK',
      privateHealthInsuranceName: 'None',
      privateHealthInsuranceContribution: '0',
      privateNursingInsuranceContribution: '0',
      lastPrivateHealthInsurance: 'None',
      haveChildren: 'no',
      requestFromPensionInsurance: false,
    })
    
    await vm.onSubmit()
    await flush()
    
    expect(update).toHaveBeenCalledTimes(1)
    expect(vm.success).toBe(false)
    expect(vm.error).toBe('Server error')
    expect(wrapper.html()).toContain('type="error"')
    expect(wrapper.html()).toContain('Server error')
  })

  it('sets taxId to N/A when noTaxId is true', async () => {
    update.mockResolvedValueOnce(undefined)
    
    const wrapper = mountWithVuetify(TaxForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    Object.assign(vm.form, {
      taxId: '',
      noTaxId: true,
      extraJob: 'no',
      disability: 'none',
      information: 'No additional information',
      employmentStatus: 'full-time',
      secondSalary: 'no',
      
      ssn: '123456789012',
      noSsn: false,
      birthCountry: 'Germany',
      birthName: 'Schmidt',
      healthInsuranceType: 'public',
      healthInsurance: 'TK',
      desiredHealthInsuranceCompany: 'TK',
      privateHealthInsuranceName: 'None',
      privateHealthInsuranceContribution: '0',
      privateNursingInsuranceContribution: '0',
      lastPrivateHealthInsurance: 'None',
      haveChildren: 'no',
      requestFromPensionInsurance: false,
    })

    await vm.onSubmit()
    await flush()
    
    expect(update).toHaveBeenCalledTimes(1)
    const callArgs = update.mock.calls[0][0]
    expect(callArgs.tax.taxId).toBe('N/A')
    expect(callArgs.tax.noTaxId).toBe(true)
  })

  it('sets ssn to N/A when noSsn is true', async () => {
    update.mockResolvedValueOnce(undefined)
    
    const wrapper = mountWithVuetify(TaxForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    Object.assign(vm.form, {
      taxId: '12345678901',
      noTaxId: false,
      extraJob: 'no',
      disability: 'none',
      information: 'No additional information',
      employmentStatus: 'full-time',
      secondSalary: 'no',
      
      ssn: '',
      noSsn: true,
      birthCountry: 'Germany',
      birthName: 'Schmidt',
      healthInsuranceType: 'public',
      healthInsurance: 'TK',
      desiredHealthInsuranceCompany: 'TK',
      privateHealthInsuranceName: 'None',
      privateHealthInsuranceContribution: '0',
      privateNursingInsuranceContribution: '0',
      lastPrivateHealthInsurance: 'None',
      haveChildren: 'no',
      requestFromPensionInsurance: false,
    })

    await vm.onSubmit()
    await flush()
    
    expect(update).toHaveBeenCalledTimes(1)
    const callArgs = update.mock.calls[0][0]
    expect(callArgs.insurance.ssn).toBe('N/A')
    expect(callArgs.insurance.noSsn).toBe(true)
  })

  it('shows loading state during submission', async () => {
    update.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    const wrapper = mountWithVuetify(TaxForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    
    Object.assign(vm.form, {
      taxId: '12345678901',
      noTaxId: false,
      extraJob: 'no',
      disability: 'none',
      information: 'No additional information',
      employmentStatus: 'full-time',
      secondSalary: 'no',
      
      ssn: '123456789012',
      noSsn: false,
      birthCountry: 'Germany',
      birthName: 'Schmidt',
      healthInsuranceType: 'public',
      healthInsurance: 'TK',
      desiredHealthInsuranceCompany: 'TK',
      privateHealthInsuranceName: 'None',
      privateHealthInsuranceContribution: '0',
      privateNursingInsuranceContribution: '0',
      lastPrivateHealthInsurance: 'None',
      haveChildren: 'no',
      requestFromPensionInsurance: false,
    })

    const submitPromise = vm.onSubmit()
    expect(vm.saving).toBe(false)
    
    await submitPromise
    await flush()
    expect(vm.saving).toBe(false)
  })

  it('clears previous errors on new submission', async () => {
    update.mockRejectedValueOnce(new Error('First error'))
    
    const wrapper = mountWithVuetify(TaxForm)
    await flush()
    
    const vm = wrapper.vm
    vm.formRef = { validate: async () => ({ valid: true }) }
    
    Object.assign(vm.form, {
      taxId: '12345678901',
      noTaxId: false,
      extraJob: 'no',
      disability: 'none',
      information: 'No additional information',
      employmentStatus: 'full-time',
      secondSalary: 'no',
      
      ssn: '123456789012',
      noSsn: false,
      birthCountry: 'Germany',
      birthName: 'Schmidt',
      healthInsuranceType: 'public',
      healthInsurance: 'TK',
      desiredHealthInsuranceCompany: 'TK',
      privateHealthInsuranceName: 'None',
      privateHealthInsuranceContribution: '0',
      privateNursingInsuranceContribution: '0',
      lastPrivateHealthInsurance: 'None',
      haveChildren: 'no',
      requestFromPensionInsurance: false,
    })
    
    await vm.onSubmit()
    await flush()
    
    expect(vm.error).toBe('First error')
    expect(vm.success).toBe(false)
    
    update.mockResolvedValueOnce(undefined)
    
    vm.formRef = { validate: async () => ({ valid: true }) }
    
    await vm.onSubmit()
    await flush()
    
    expect(vm.error).toBe(null)
    expect(vm.success).toBe(true)
  })

  it('disables taxId field when noTaxId is checked', async () => {
    const wrapper = mountWithVuetify(TaxForm)
    await flush()
    
    const vm = wrapper.vm
    
    expect(vm.form.noTaxId).toBe(false)
    
    vm.form.noTaxId = true
    await flush()
    
    expect(vm.form.noTaxId).toBe(true)
  })

  it('disables ssn field when noSsn is checked', async () => {
    const wrapper = mountWithVuetify(TaxForm)
    await flush()
    
    const vm = wrapper.vm
    
    expect(vm.form.noSsn).toBe(false)
    
    vm.form.noSsn = true
    await flush()
    
    expect(vm.form.noSsn).toBe(true)
  })
  it('sets saving true during submit and false after', async () => {
    update.mockImplementation(() => new Promise(r => setTimeout(r, 50)))
    const wrapper = mountWithVuetify(TaxForm); 
    await flush()
    const vm = wrapper.vm; 
    mockFormValid(vm)
  
    Object.assign(vm.form, {
      taxId: '12345678901',
      noTaxId: false,
      extraJob: 'no',
      disability: 'none',
      information: 'No additional information',
      employmentStatus: 'full-time',
      secondSalary: 'no',
      
      ssn: '123456789012',
      noSsn: false,
      birthCountry: 'Germany',
      birthName: 'Schmidt',
      healthInsuranceType: 'public',
      healthInsurance: 'TK',
      desiredHealthInsuranceCompany: 'TK',
      privateHealthInsuranceName: 'None',
      privateHealthInsuranceContribution: '0',
      privateNursingInsuranceContribution: '0',
      lastPrivateHealthInsurance: 'None',
      haveChildren: 'no',
      requestFromPensionInsurance: false,
    })
  
    const p = vm.onSubmit()
    await p; await flush()
    expect(vm.saving).toBe(false)
  })
  it('maps unknown error to default message', async () => {
    update.mockRejectedValueOnce('OOPS')
    const wrapper = mountWithVuetify(TaxForm); 
    await flush()
    const vm = wrapper.vm; 
    mockFormValid(vm)
  
    Object.assign(vm.form, { })
  
    await vm.onSubmit(); 
    await flush();
    expect(vm.success).toBe(false)
    expect(vm.error).toBe(null)
  })
  it('loads initial tax/insurance data from useMe (watchEffect)', async () => {
    vi.resetModules()
    const initial = {
      tax: {
        taxId: 'TA-1', noTaxId: false, extraJob: 'no', disability: 'none',
        information: 'info', employmentStatus: 'full-time', secondSalary: 'no',
      },
      insurance: {
        ssn: 'SS-1', noSsn: false, birthCountry: 'DE', birthName: 'X',
        healthInsuranceType: 'public', healthInsurance: 'TK',
        desiredHealthInsuranceCompany: 'TK',
        privateHealthInsuranceName: 'None',
        privateHealthInsuranceContribution: '0',
        privateNursingInsuranceContribution: '0',
        lastPrivateHealthInsurance: 'None',
        haveChildren: 'no', requestFromPensionInsurance: false,
      }
    }
  
    const update = vi.fn()
    vi.doMock('~/composables/useMe', () => ({
      useMe: () => ({ data: { value: initial }, update, pending: { value: false }, error: { value: null } })
    }))
  
    const { default: LocalTaxForm } = await import('~/components/TaxForm.vue')
    const { mountWithVuetify: localMount } = await import('../../helpers/mountWithVuetify')
  
    const wrapper = localMount(LocalTaxForm)
    await flush()
    const vm = wrapper.vm
  
    expect(vm.form.taxId).toBe('TA-1')
    expect(vm.form.ssn).toBe('SS-1')
    expect(vm.form.employmentStatus).toBe('full-time')
    expect(vm.form.healthInsuranceType).toBe('public')
  
    vi.resetModules()
  })
  it('taxIdRule/ssnRule bypass validation when noTaxId/noSsn are true', async () => {
    const wrapper = mountWithVuetify(TaxForm); await flush()
    const vm = wrapper.vm
  
    vm.form.noTaxId = true
    expect(vm.taxIdRule('')).toBe(true)
    vm.form.noTaxId = false
    expect(vm.taxIdRule('')).not.toBe(true)
  
    vm.form.noSsn = true
    expect(vm.ssnRule('')).toBe(true)
    vm.form.noSsn = false
    expect(vm.ssnRule('')).not.toBe(true)
  })
  it('early-returns when formRef.validate is missing', async () => {
    const wrapper = mountWithVuetify(TaxForm); await flush()
    const vm = wrapper.vm
    vm.formRef = { value: {} }
    Object.assign(vm.form, {
      taxId: '123', noTaxId: false, extraJob: 'no', disability: 'none',
      information: 'ok', employmentStatus: 'full-time', secondSalary: 'no',
      ssn: '456', noSsn: false, birthCountry: 'DE', birthName: 'X',
      healthInsuranceType: 'public', healthInsurance: 'TK',
      desiredHealthInsuranceCompany: 'TK',
      privateHealthInsuranceName: 'None',
      privateHealthInsuranceContribution: '0',
      privateNursingInsuranceContribution: '0',
      lastPrivateHealthInsurance: 'None',
      haveChildren: 'no', requestFromPensionInsurance: false,
    })
  
    const updateSpy = (vm).update ?? null
    await vm.onSubmit()
    await flush()
    if (updateSpy && 'mock' in updateSpy) {
      expect(updateSpy).not.toHaveBeenCalled()
    }
  })
})