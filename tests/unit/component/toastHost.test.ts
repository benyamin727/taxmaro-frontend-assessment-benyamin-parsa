/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick } from "vue";
import { mountWithVuetify } from "../../helpers/mountWithVuetify";
import ToastHost from "~/components/ui/ToastHost.vue";

const shared = {
  toasts: { value: [] },
  push: vi.fn(),
  dismiss: vi.fn((id?: number) => {
    if (id) shared.toasts.value = shared.toasts.value.filter(t => t.id !== id);
    else shared.toasts.value = [];
  }),
  colorOf: (k: string) =>
    ({ success: "success", error: "error", info: "primary", warning: "warning", loading: "grey" })[k] || "primary",
};

vi.mock("@/composables/useToast", () => ({
  useToast: () => shared,
}));

const flush = async () => {
  await nextTick();
  await new Promise(r => setTimeout(r, 0));
};

describe("ToastHost.vue", () => {
  beforeEach(() => {
    shared.toasts.value = [];
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders stacked snackbars for toasts", async () => {
    shared.toasts.value = [
      { id: 1, text: "A info", kind: "info", timeout: 3000 },
      { id: 2, text: "B success", kind: "success", timeout: 3000 },
    ];

    const wrapper = mountWithVuetify(ToastHost);
    await flush();

    const snackbars = wrapper.findAll('[data-test="toast-snackbar"]');
    expect(snackbars.length).toBe(2);

    expect(wrapper.text()).toContain("A info");
    expect(wrapper.text()).toContain("B success");
  });

  it("shows loader for 'loading' kind and dismisses on click", async () => {
    shared.toasts.value = [
      { id: 10, text: "Saving...", kind: "loading", timeout: "persistent" },
    ];
    const wrapper = mountWithVuetify(ToastHost);
    await flush();

    const loader = wrapper.find('[data-test="toast-loading"]');
    expect(loader.exists()).toBe(true);

    const sn = wrapper.get('[data-test="toast-snackbar"]');
    await sn.trigger("click");
    await flush();

    expect(shared.toasts.value.length).toBe(0);
  });
});
