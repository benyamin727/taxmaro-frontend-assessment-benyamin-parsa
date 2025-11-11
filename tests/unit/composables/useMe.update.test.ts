/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, it, expect, vi } from 'vitest'
import { useMe } from '../../../app/composables/useMe'

const g = global as unknown

describe('composables/useMe UPDATE', () => {
  it('updatePersonal sends only personal fields', async () => {
    g.$fetch = vi.fn()
      .mockResolvedValueOnce({}) // GET (ignored in this test)
      .mockResolvedValueOnce({ success: true }) // PUT

    const { updatePersonal } = useMe()
    await updatePersonal({
      firstName: 'Jane', lastName: 'Doe', email: 'j@d.com',
      phone: '123', address: 'a', city: 'c', state: 's', zip: 'z', country: 'DE',
      position: 'FE', department: null
    } as unknown)

    expect(g.$fetch).toHaveBeenCalledWith('/api/me', {
      method: 'PUT',
      body: {
        firstName: 'Jane', lastName: 'Doe', email: 'j@d.com',
        phone: '123', address: 'a', city: 'c', state: 's', zip: 'z', country: 'DE',
        position: 'FE', department: null
      }
    })
  })

  it('updateBank sends only bankDetail', async () => {
    g.$fetch = vi.fn()
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ success: true })

    const { updateBank } = useMe()
    await updateBank({
      bankDetail: {
        bankName: 'N26', bankBic: 'NTSBDEB1XXX', iban: 'DE44...', id: '1', bankId: 'BK1', paymentMethod: 'sepa', payee: 'Jane'
      }
    } as unknown)

    expect(g.$fetch).toHaveBeenCalledWith('/api/me', {
      method: 'PUT',
      body: { bankDetail: expect.any(Object) }
    })
  })

  it('update (tax+insurance) sends single PUT', async () => {
    g.$fetch = vi.fn()
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ success: true })

    const { update } = useMe()
    await update({
      tax: { noTaxId: true, extraJob: 'no', disability: 'none', information: '-', employmentStatus: 'full-time', secondSalary: 'no' },
      insurance: { noSsn: true, birthCountry: 'Tehran', birthName: 'X', healthInsuranceType:'public', healthInsurance:'TK', desiredHealthInsuranceCompany:'TK', privateHealthInsuranceName:'', privateHealthInsuranceContribution:'', privateNursingInsuranceContribution:'', lastPrivateHealthInsurance:'', haveChildren:'no', requestFromPensionInsurance:false }
    } as unknown)

    const putCall = g.$fetch.mock.calls.find((c: unknown[]) => c[0] === '/api/me' && c[1]?.method === 'PUT')
    expect(putCall).toBeTruthy()
    expect(putCall[1].body.tax.noTaxId).toBe(true)
    expect(putCall[1].body.insurance.noSsn).toBe(true)
  })
})
