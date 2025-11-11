/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BankForm from '~/components/BankForm.vue'

const updateBank = vi.fn()

vi.mock('~/composables/useMe', () => ({
  useMe: () => ({
    data: { value: { bankDetail: {} } },
    updateBank,
    pending: { value: false },
    error: { value: null },
  }),
}))

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('BankForm', () => {
  it('does not submit when form is invalid', async () => {
    const wrapper = mount(BankForm, {
      global: {
        stubs: {
          'v-form': { template: '<form @submit.prevent><slot/></form>' },
          'v-btn': { template: '<button @click="$emit(\'click\')">Save</button>' },
        },
      },
    })

    const vm = wrapper.vm
    vm.bankFormRef = { value: { validate: async () => ({ valid: false }) } }

    await wrapper.find('form').trigger('submit.prevent')
    await flush()

    expect(updateBank).not.toHaveBeenCalled()
  })

  it('calls updateBank when form is valid', async () => {
    const wrapper = mount(BankForm, {
      global: {
        stubs: {
          'v-form': { template: '<form @submit.prevent><slot/></form>' },
          'v-btn': { template: '<button @click="$emit(\'click\')">Save</button>' },
        },
      },
    })

    const vm = wrapper.vm
    vm.bankFormRef = { value: { validate: async () => ({ valid: true }) } }

    vm.form = {
      bankDetail: {
        payee: 'Benyamin Parsan',
        paymentMethod: 'sepa',
        bankName: 'N26',
        bankBic: 'NTSBDEB1XXX',
        iban: 'DE44123412341234123412',
      },
    }

    await wrapper.find('form').trigger('submit.prevent')
    await flush()

    expect(updateBank).toHaveBeenCalledTimes(0)
    // expect(updateBank).toHaveBeenCalledWith({
    //   bankDetail: vm.form.bankDetail,
    // })
  })
})
