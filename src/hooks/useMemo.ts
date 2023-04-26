import {Signal} from "../signal.js"

export function useMemo<T, S extends Signal<any>>(fn: () => T, deps: S[], equal = (x: T, y: T) => Object.is(x, y)){
  const res = new Signal<T>(fn(), equal);
  deps.forEach( s => s.pipe(() => res.value = fn()) )
  return res
}
