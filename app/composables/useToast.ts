import { shallowRef } from "vue";

type ToastKind = "success" | "error" | "info" | "warning" | "loading";
type Toast = {
  id: number;
  text: string;
  kind: ToastKind;
  timeout?: number | "persistent";
};

const toasts = shallowRef<Toast[]>([]);
let _id = 1;

const colorMap: Record<ToastKind, string> = {
  success: "success",
  error: "error",
  info: "primary",
  warning: "warning",
  loading: "grey",
};

function push(text: string, kind: ToastKind = "info", timeout = 3000) {
  const id = _id++;
  toasts.value = [
    ...toasts.value,
    { id, text, kind, timeout: kind === "loading" ? "persistent" : timeout },
  ];
  return id;
}

function dismiss(id?: number) {
  if (!id) {
    toasts.value = [];
  } else {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }
}

function update(id: number, next: Partial<Omit<Toast, "id">>) {
  toasts.value = toasts.value.map((t) => (t.id === id ? { ...t, ...next } : t));
}

export function useToast() {
  return {
    toasts,
    push,
    dismiss,
    update,
    success: (m: string, timeout = 3000) => push(m, "success", timeout),
    error: (m: string, timeout = 4000) => push(m, "error", timeout),
    info: (m: string, timeout = 3000) => push(m, "info", timeout),
    warning: (m: string, timeout = 4000) => push(m, "warning", timeout),
    loading: (m: string) => push(m, "loading", 0),
    colorOf: (k: ToastKind) => colorMap[k],
  };
}
