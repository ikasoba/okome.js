import {
  toDOMNode,
  type ChildNodeType,
  type ChildrenNode,
  type Component,
} from "./index.js";

export declare namespace JSX {
  interface ElementChildrenAttribute {
    children: ChildNodeType;
  }

  type ElementClass = Component<any>;

  type Element = ChildNodeType;

  interface IntrinsicElements {
    [elm: string]: any;
  }
}

export * from "./index.js";
