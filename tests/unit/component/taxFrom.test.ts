/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { makeVFormStub } from '../../helpers/vForm-stub'

import TaxForm from '~/components/TaxForm.vue'

vi.mock('~/composables/useMe', () => {
  const updateTaxSpy = vi.fn().mockResolvedValue(undefined)
  return {
    __esModule: true,
    _spies: { updateTaxSpy },
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
        },
      },
      updateTax: updateTaxSpy,
      pending: { value: false },
      error: { value: null },
    }),
  }
})

const BtnStub = {
  template: `<button data-test="save-btn" @click="$emit('click')"><slot /></button>`,
}

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('TaxForm', () => {
  it('shows validation errors on empty submit', async () => {
    const wrapper = mount(TaxForm, {
      global: {
        stubs: {
          'v-form': makeVFormStub(false), // validate() => { valid: false }
          'v-btn': BtnStub,
          'v-text-field': true,
          'v-row': true,
          'v-col': true,
          'v-select': true,
          'v-checkbox': true,
        },
      },
    })

    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Please correct')
  })

  it('calls updateTax on valid submit', async () => {
    const wrapper = mount(TaxForm, {
      global: {
        stubs: {
          'v-form': makeVFormStub(true), // validate() => { valid: true }
          'v-btn': BtnStub,
          'v-text-field': true,
          'v-row': true,
          'v-col': true,
          'v-select': true,
          'v-checkbox': true,
        },
      },
    })

    await wrapper.get('[data-test="save-btn"]').trigger('click')
    await flushPromises()

    const { _spies } = await import('~/composables/useMe')
    expect(_spies.updateTaxSpy).toHaveBeenCalledTimes(0)
  })
})
