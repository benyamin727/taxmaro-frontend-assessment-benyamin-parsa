import { describe, it, expect } from 'vitest'
import {
  required, email, minLen, combine,
  ibanLite, bicLite, phoneLite, postalLite
} from '../../../app/utils/validation'

describe('utils/validation', () => {
  it('required', () => {
    expect(required('')).toBe('Required')
    expect(required('ok')).toBe(true)
  })

  it('email', () => {
    expect(email('foo@bar.com')).toBe(true)
    expect(email('foo@bar')).toBe('Invalid email')
  })

  it('minLen/combine', () => {
    const rule = combine(required, minLen(3))
    expect(rule('')).toBe('Required')
    expect(rule('hi')).toBe('Min 3 chars')
    expect(rule('hey')).toBe(true)
  })

  it('IBAN/BIC/phone/postal lite', () => {
    expect(ibanLite('DE44 1234 1234 1234 1234 12')).toBe(true)
    expect(ibanLite('DE')).toBe('Invalid IBAN')

    expect(bicLite('NTSBDEB1XXX')).toBe(true)
    expect(bicLite('BAD')).toBe('Invalid BIC')

    expect(phoneLite('+49 (151) 123456')).toBe(true)
    expect(phoneLite('x')).toBe('Invalid phone')

    expect(postalLite('45127')).toBe(true)
    expect(postalLite('!!')).toBe('Invalid zip/postcode')
  })
})
