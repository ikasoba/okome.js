import {setHooksManager} from "@ikasoba000/okome.js"
import {Signal} from "@ikasoba000/okome.js/signal"
import {NormalHooksManager} from "@ikasoba000/okome.js/HooksManager"
import {useEffect} from "@ikasoba000/okome.js/hooks/useEffect"

function App(){
  const count = new Signal(0)
  
  useEffect(() => {
    console.log("count:", count.value)
  }, [count])
  
  return (
    <div>
      <button on:click={() => count.value++}>
        count: {count}
      </button>
    </div>
  )
}

document.body.append(<App/>)