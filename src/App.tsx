import './App.css'
import "@blueprintjs/core/lib/css/blueprint.css";
import { GachaMachine } from './components/GachaMachine'
import { GachaDataLoader } from './components/GachaSheetDataLoader'
import { PlayerLoader } from './contexts/player-context'
import { Album } from './components/Album';

function App() {
  return (
    <div className="App">
      <h1>Wibble Gachapon</h1>
      <PlayerLoader>
        <GachaDataLoader>
          <>
            <GachaMachine />
            <Album />
          </>
        </GachaDataLoader>
      </PlayerLoader>
      <div>
      </div>
    </div>
  )
}

export default App
