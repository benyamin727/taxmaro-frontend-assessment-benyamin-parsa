/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, it, expect, vi } from 'vitest'
import { useMe } from '../../../app/composables/useMe'

const g = global as unknown

describe('composables/useMe GET', () => {
  it('fetches /api/me and fills data', async () => {
    g.$fetch = vi.fn()
      .mockResolvedValueOnce({
        firstName: 'John', lastName: 'Doe',
        email: 'john@doe.com', phone: '+49...',
        address: 'Street 1', city: 'Essen', state: 'NRW', zip: '45127', country: 'DE',
        position: 'FE', department: null,
        bankDetail: { bankName:'', bankBic:'', iban:'', id:'', bankId:'', paymentMethod:'', payee:'' },
        tax: { taxId:'', noTaxId:false, extraJob:'no', disability:'none', information:'-', employmentStatus:'full-time', secondSalary:'no' },
        insurance: { ssn:'', noSsn:false, birthCountry:'', birthName:'', healthInsuranceType:'', healthInsurance:'', desiredHealthInsuranceCompany:'', privateHealthInsuranceName:'', privateHealthInsuranceContribution:'', privateNursingInsuranceContribution:'', lastPrivateHealthInsurance:'', haveChildren:'no', requestFromPensionInsurance:false }
      })

    const { data, pending, error } = useMe()
    await new Promise(r => setTimeout(r, 0))

    expect(pending.value).toBe(false)
    expect(error.value).toBeNull()
    expect(data.value?.firstName).toBe('John')
  })
})
