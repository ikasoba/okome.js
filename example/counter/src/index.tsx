import { Signal } from "@ikasoba000/okome.js/signal";
import { useEffect } from "@ikasoba000/okome.js/hooks/useEffect";
import { For } from "@ikasoba000/okome.js/components/for";
import { toDOMNode } from "@ikasoba000/okome.js/jsx-runtime";

function App() {
  const count = new Signal<number>(0);
  const arr = new Signal<number[]>([]);

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
