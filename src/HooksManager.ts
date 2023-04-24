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
}

export class NormalHooksManager implements HooksManager {
  private stack: Set<HooksFunction>[] = [];

  begin() {
    this.stack.push(new Set());
  }

  add(...funcs: HooksFunction[]) {
    const space = this.stack[this.stack.length - 1];
    if (!space) return;
    funcs.forEach((f) => space.add(f));
  }

  pop() {
    return this.stack.pop();
  }

  dispatch(space: Set<HooksFunction>): void {
    if (!space) return;
    space.forEach((f) => f());
  }
}
