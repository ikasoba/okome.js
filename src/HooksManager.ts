import type { Signal } from "./signal.js";

export type HooksFunction = () => void;

/** hooksを管理するスタック */
export interface HooksManager {
  /** スペースを追加する */
  begin(): void;

  /** スペースにhooksを追加する */
  add(...funcs: HooksFunction[]): void;

  /** スペースをpopする */
  pop(): Set<HooksFunction> | undefined;

  /** スペースにあるhooksをすべて実行する */
  dispatch(space: Set<HooksFunction>): void;

  onCleanup(fn: () => void): void;
}

export class NormalHooksManager implements HooksManager {
  private stack: { hooks: Set<HooksFunction>; signals: Signal<any>[] }[] = [];

  constructor(public root: Element) {}

  begin() {
    this.stack.push({ hooks: new Set(), signals: [] });
  }

  add(...funcs: HooksFunction[]) {
    const space = this.stack[this.stack.length - 1];
    if (space) funcs.forEach((f) => space.hooks.add(f));
  }

  pop() {
    return this.stack.pop()?.hooks;
  }

  dispatch(space: Set<HooksFunction>): void {
    space.forEach((f) => f());
  }

  onCleanup(fn: () => void): void {}
}
