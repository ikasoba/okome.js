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

export type Component<A extends {} = {}> = (attrs: A) => ChildNodeType;

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
    } & { children?: ChildrenNode }
  : ArgType<Exclude<N, string>>[0];

export type ChildNodeType = StringableValue | Node | Signal<any>;
export type ChildrenNode = ChildNodeType[] | ChildNodeType;

export function toDOMNode<T extends ChildNodeType>(x: T): Node {
  if (x instanceof Signal) {
    let prevValue = toDOMNode(x.value);
    let fragmentChildren =
      prevValue instanceof DocumentFragment ? [...prevValue.childNodes] : [];
    // 今のノードがフラグメントなら子をfragmentChildrenに集めることでごっそり書き換えられるようにしている
    x.onUpdate((_value) => {
      const value = toDOMNode(_value);
      if (prevValue instanceof DocumentFragment) {
        if (fragmentChildren.length) {
          fragmentChildren[0].parentNode?.replaceChild(
            value,
            fragmentChildren[0]
          );
          fragmentChildren
            .slice(1)
            .forEach((x) => x.parentNode?.removeChild(x));
        }
        fragmentChildren = [];
      } else if (value instanceof DocumentFragment) {
        fragmentChildren = [...value.childNodes];
        prevValue.parentNode?.replaceChild(value, prevValue);
      } else {
        prevValue.parentNode?.replaceChild(value, prevValue);
      }
      prevValue = value;
    });
    return prevValue;
  } else if (x == null) {
    return document.createComment("");
  }
  return x instanceof Node ? x : document.createTextNode(`${x}`);
}

export function createElement<N extends string | Component<any>>(
  name: N,
  _attrs?: GetAttrs<N>
) {
  hooksManager?.begin();
  try {
    if (typeof name != "string") return toDOMNode(name(_attrs));
    const attrs: { children?: Node[] | Node } = {
      ..._attrs,
      ...{
        children: _attrs?.children
          ? _attrs.children instanceof Array
            ? _attrs.children.map(toDOMNode)
            : toDOMNode(_attrs?.children)
          : undefined,
      },
    };
    const elm = document.createElement(name);
    for (let k in attrs) {
      const v = attrs[k as keyof typeof attrs];
      if (k == "children") {
        if (v instanceof Array) {
          elm.append(...v);
        } else if (v) {
          elm.append(v);
        }
      } else if (k.startsWith("on:")) {
        k = k.slice(3);
        if (v instanceof Signal) {
          v.onUpdate((value) => elm.addEventListener(k, value));
          elm.addEventListener(k, v.value);
        }
        //@ts-ignore
        if (v instanceof Function) elm.addEventListener(k, v);
      } else if (v instanceof Signal) {
        v.onUpdate((value: any) => elm.setAttribute(k, `${value}`));
        elm.setAttribute(k, `${v.value}`);
      } else elm.setAttribute(k, `${v}`);
    }
    return elm;
  } finally {
    const space = hooksManager?.pop();
    if (space) setTimeout(() => hooksManager?.dispatch(space), 0);
  }
}

export const Fragment: Component<{ children: ChildrenNode }> = ({
  children,
}) => {
  const fragment = document.createDocumentFragment();
  fragment.append(
    ...(children instanceof Array ? children : [children]).map(toDOMNode)
  );
  return fragment;
};

export const jsx = createElement;
export const jsxs = createElement;

export default {
  jsx,
  jsxs,
};
