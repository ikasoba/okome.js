import type { Option } from "../types/option.js";
import type { HooksManager } from "./HooksManager.js";
import { Signal } from "./signal.js";

let hooksManager: Option<HooksManager> = null;

export function setHooksManager(newManager?: HooksManager) {
  hooksManager = newManager;
}

export function getHooksManager() {
  return hooksManager;
}

export type StringableValue =
  | string
  | number
  | bigint
  | boolean
  | object
  | null
  | undefined;

export type Component = (attrs: {}) => StringableValue | Node;

type RemoveStart<
  R extends string,
  S extends `${R}${string}`
> = S extends `${R}${infer T}` ? T : never;
type ArgType<F extends (...a: any[]) => any> = F extends (...a: infer T) => any
  ? T
  : never;

export type GetAttrs<N extends string | Component> = N extends string
  ? { [k: string]: StringableValue | Signal<any> } & {
      [K in `on:${keyof HTMLElementEventMap}`]:
        | ((event: HTMLElementEventMap[RemoveStart<"on:", K>]) => void)
        | Signal<any>;
    }
  : ArgType<Exclude<N, string>> & { children: ChildNodeType[] };

export type ChildNodeType = StringableValue | Node | Signal<any>;

export function toDOMNode<T extends ChildNodeType>(x: T) {
  console.log(x);
  if (x instanceof Signal) {
    let node =
      x.value instanceof Node ? x.value : document.createTextNode(`${x.value}`);
    x.onUpdate((value) => {
      value = value instanceof Node ? value : toDOMNode(value);
      node.parentNode?.replaceChild(value, node);
      node = value;
    });
    return node;
  } else if (x instanceof Node) {
    return x;
  } else {
    return document.createTextNode(`${x}`);
  }
}

export function createElement<N extends string | Component>(
  name: N,
  attrs: GetAttrs<N>,
  ...children: ChildNodeType[]
) {
  hooksManager?.begin();
  try {
    if (typeof name == "string") {
      const elm = document.createElement(name);
      for (let [k, v] of Object.entries(attrs)) {
        if (k.startsWith("on:")) {
          k = k.slice(3);
          if (!(v instanceof Signal || v instanceof Function)) continue;
          if (v instanceof Signal) {
            v.onUpdate((value) => elm.setAttribute(k, `${value}`));
            elm.addEventListener(k, v.value);
            continue;
          }
          //@ts-ignore
          elm.addEventListener(k, v);
          continue;
        }
        if (v instanceof Signal) {
          v.onUpdate((value: any) => elm.setAttribute(k, `${value}`));
          elm.setAttribute(k, `${v.value}`);
          continue;
        }
        elm.setAttribute(k, `${v}`);
      }
      elm.append(...children.map(toDOMNode));
      return elm;
    } else {
      return toDOMNode(name({ ...attrs, children }));
    }
  } finally {
    const space = hooksManager?.pop();
    if (!space) return;
    requestAnimationFrame(() => hooksManager?.dispatch(space));
  }
}
