import './App.css'
import "@blueprintjs/core/lib/css/blueprint.css";
import { GachaMachine } from './components/GachaMachine'
import { GachaDataLoader } from './components/GachaSheetDataLoader'
import { PlayerLoader } from './contexts/player-context'
import { Album } from './components/Album';
import { CansDisplay } from './components/CansDisplay';
function App() {
  return (
    <div className="App">
      <PlayerLoader>
        <GachaDataLoader>
          <>
            <GachaMachine />
            <CansDisplay />
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
