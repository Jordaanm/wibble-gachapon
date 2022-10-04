import * as React from 'react';
import { PlayerContext } from '../contexts/player-context';
import { PlayerEvents } from '../models/player-model';

import "./CansDisplay.scss";


export function CansDisplay() {
  const playerModel = React.useContext(PlayerContext);

  const [cans, setCans] = React.useState<number>(playerModel.cans);
  
  React.useEffect(() => {
    playerModel.AddListener('CansDisplay', (eventName, data) => {
      if(eventName === PlayerEvents.AddCredits || eventName === PlayerEvents.AddCans || eventName === PlayerEvents.NewGame) {
        setCans(playerModel.cans);
      }
    });
  });

  return (
    <div className="cans-display">
      <img src="/can.png"/> x <span className='amount'>{cans}</span>
    </div>
  );
}