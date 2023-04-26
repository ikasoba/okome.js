# Okome.js

Okome.js is a minimal, modern frontend framework.
Performance is currently not good.

# Usage

```tsx
import { Signal } from "@ikasoba000/okome.js/signal";
import { useEffect } from "@ikasoba000/okome.js/hooks/useEffect";
import { toDOMNode } from "@ikasoba000/okome.js";

function App() {
  const count = new Signal<number>(0);

  useEffect(() => {
    console.log("count:", count.value);
  }, [count]);

  return (
    <>
      <button on:click={() => count.value++}>count: {count}</button>
    </>
  );
}

document.body.append(toDOMNode(<App />));
```
