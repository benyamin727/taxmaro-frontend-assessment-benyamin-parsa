// @ts-check
import { mount, type MountingOptions } from '@vue/test-utils'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify()

export function mountWithVuetify<V>(
  component: unknown,
  options: MountingOptions<V> = {}
) {
  return mount(component, {
    global: {
      plugins: [vuetify],
      stubs: { transition: false },
      ...(options.global || {}),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(options as any),
  })
}
