export interface Context<V> {
  get(key: string): V
  set(key: string, value: V): void
}

let contexts: {[key: string]: Context<any>} = {}

export function useContext(key: string = "global"){
  if (!contexts[key]){
    contexts[key] = new Map<string, any>()
  }
  return contexts[key]
}
