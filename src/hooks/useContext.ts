let contexts: { [key: string]: Map<any, any> } = {};

export function useContext<C extends Map<any, any>>(key: string = "global"): C {
  if (!contexts[key]) {
    contexts[key] = new Map<string, any>();
  }
  return contexts[key] as C;
}
