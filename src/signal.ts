export type SignalListener<T> = (value: T, signal: Signal<T>) => void;

export class Signal<T> {
  private listeners = new Set<SignalListener<T>>();
  constructor(
    private _value: T,
    private equal = (x: T, y: T) => Object.is(x, y)
  ) {}

  get value() {
    return this._value;
  }

  set value(newValue: T) {
    if (this.equal(this._value, newValue)) {
      return;
    }
    this._value = newValue;
    this.listeners.forEach((f) => f(this._value, this));
  }

  pipe<R>(
    listener: (value: T, signal: Signal<T>) => R,
    equal = (x: R, y: R) => Object.is(x, y)
  ): Signal<R> {
    const signal = new Signal<R>(listener(this.value, this), equal);
    this.onUpdate((v, s) => {
      signal.value = listener(v, s);
    });
    return signal;
  }

  onUpdate(listener: SignalListener<T>) {
    this.listeners.add(listener);
    return this;
  }

  removeListener(listener: SignalListener<T>) {
    return this.listeners.delete(listener);
  }
}
