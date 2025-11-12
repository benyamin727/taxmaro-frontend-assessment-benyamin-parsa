/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseTabs from '~/components/ui/BaseTabs.vue'

const tabs = [
  { key: 'personal', label: 'Personal' },
  { key: 'bank',     label: 'Bank' },
  { key: 'tax',      label: 'Tax' },
]

describe('BaseTabs', () => {
  it('renders all tabs and marks the active one', async () => {
    const wrapper = mount(BaseTabs, {
      props: { modelValue: 'personal', tabs },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3)
    expect(wrapper.text()).toContain('Personal')
    expect(wrapper.text()).toContain('Bank')
    expect(wrapper.text()).toContain('Tax')

    expect(buttons[0].classes()).toContain('tabs__item--active')
    expect(buttons[1].classes()).not.toContain('tabs__item--active')

    await wrapper.setProps({ modelValue: 'bank' })
    expect(buttons[1].classes()).toContain('tabs__item--active')
    expect(buttons[0].classes()).not.toContain('tabs__item--active')
  })

  it('emits update:modelValue when a tab is clicked', async () => {
    const wrapper = mount(BaseTabs, {
      props: { modelValue: 'personal', tabs },
    })

    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')

    const emits = wrapper.emitted('update:modelValue')
    expect(emits).toBeTruthy()
    expect(emits?.[0]).toEqual(['bank'])
  })
})
