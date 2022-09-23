import './App.css'
import "@blueprintjs/core/lib/css/blueprint.css";
import { GachaMachine } from './components/GachaMachine'
import { GachaDataLoader } from './components/GachaSheetDataLoader'
import { WibbleDropModal } from './components/WibbleDropModal'
import { PlayerLoader } from './contexts/player-context'

function App() {
  return (
    <div className="App">
      <h1>Wibble Gachapon</h1>
      <PlayerLoader>
        <GachaDataLoader>
          <>
            <GachaMachine />
          </>
        </GachaDataLoader>
      </PlayerLoader>
      <div>
        <button>
          History
        </button>
        <button>
          Gallery
        </button>
      </div>
    </div>
  )
}

export default App
