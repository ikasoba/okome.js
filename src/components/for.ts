import {
  ChildNodeType,
  ChildrenNode,
  Component,
  toDOMNode,
} from "../jsx-runtime.js";
import { Signal } from "../signal.js";

// TODO: このままだと大量の配列を処理すると重たいのでちゃんとした実装にする
export const For = <A extends any[]>(prop: {
  each: Signal<A>;
  children: (value: A[number], i: number) => ChildNodeType;
}): ChildNodeType => {
  let prevChildren: Node[] = [];

  const fragment = document.createDocumentFragment();

  prop.each.pipe((arr) => {
    const children: Node[] = [];

    for (let i = 0; i < arr.length; i++) {
      const node = toDOMNode(prop.children(arr[i], i));
      if (node instanceof DocumentFragment) {
        children.push(...node.childNodes);
      } else children.push(node);
    }
    for (let i = 0; i < children.length && i < prevChildren.length; i++) {
      prevChildren[i].parentNode?.replaceChild(children[i], prevChildren[i]);
    }
    if (children.length > prevChildren.length) {
      for (let i = prevChildren.length; i < children.length; i++) {
        const prev = children[i - 1];
        console.log(children[i], prev, i, prevChildren.length, children.length);
        prev.parentNode?.insertBefore(children[i], prev?.nextSibling);
      }
    } else if (children.length == 0) {
      const comment = document.createComment("");
      children.push(comment);
      if (prevChildren.length) {
        prevChildren[0]?.parentNode?.replaceChild(comment, prevChildren[0]);
        prevChildren.slice(1).forEach((n) => n.parentNode?.removeChild(n));
      }
    } else {
      prevChildren
        .slice(children.length)
        .forEach((n) => n.parentNode?.removeChild(n));
    }
    prevChildren = children;
  });

  fragment.append(...prevChildren);

  return fragment;
};
