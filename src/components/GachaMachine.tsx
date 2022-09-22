import * as React from 'react';
import { GachaModelContext } from '../contexts/gacha-context';
import { PlayerContext } from '../contexts/player-context';
import { PlayerEvents } from '../models/player-model';
import './GachaMachine.scss';

let dialTimer: number|undefined = undefined;

export function GachaMachine() {
  const gachaModel = React.useContext(GachaModelContext);
  const playerModel = React.useContext(PlayerContext);

  const [credits, setCredits] = React.useState<number>(playerModel.Credits());

  React.useEffect(() => {
    playerModel.AddListener((eventName, data) => {
      if(eventName === PlayerEvents.AddCredits || eventName === PlayerEvents.PayCredits) {
        setCredits(playerModel.Credits());
      }
    });
  });

  const onDialPress = () => {
    console.log("Dial:StartingTimer");
    dialTimer = setTimeout(() => {
      gachaModel?.PerformRoll(1);
    }, 2500);
  }

  const onDialRelease = () => { 
    
    console.log("Dial:ClearingTimer");
    clearTimeout(dialTimer); 
  }

  return (
    <div className="gacha-machine">
      <div className="machine">
        <div className="dial" onMouseDown={onDialPress} onMouseUp={onDialRelease}></div>
        <div className="slot"></div>
        <div className="credits" onClick={() => gachaModel?.AddCredits(1)}>
          <div className="credits--label">{credits}</div>
        </div>
        <div className="title-plate">
          <div className="title-plate--label">Wibble Gacha</div>
        </div>
      </div>
    </div>
  );
}