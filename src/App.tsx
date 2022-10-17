import './App.css'
import "@blueprintjs/core/lib/css/blueprint.css";
import { GachaMachine } from './components/GachaMachine'
import { GachaDataLoader } from './components/GachaSheetDataLoader'
import { PlayerLoader } from './contexts/player-context'
import { Album } from './components/Album';
import { CansDisplay } from './components/CansDisplay';
import { AnimatedBackground, Bokeh } from './components/animated-background';
import { Refunds } from './components/Refunds';
function App() {
  return (
    <div className="App">
      <Bokeh />
      <PlayerLoader>
        <GachaDataLoader>
          <>
            <Refunds />
            <Album />
            <GachaMachine />
            <CansDisplay />
          </>
        </GachaDataLoader>
      </PlayerLoader>
      <div>
      </div>
    </div>
  )
}

export default App
