import { getHooksManager } from "../index.js";
import { Signal } from "../signal.js";

export function useEffect<T>(fn: () => void, signals: Signal<T>[]) {
  const manager = getHooksManager();
  manager?.add(fn);
  signals.forEach((s) => s.onUpdate(fn));
}
