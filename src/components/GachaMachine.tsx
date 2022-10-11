import { Tooltip } from '@blueprintjs/core';
import * as React from 'react';
import { GachaModelContext } from '../contexts/gacha-context';
import { PlayerContext } from '../contexts/player-context';
import { PITY_THRESHOLD_4STAR, PITY_THRESHOLD_5STAR } from '../models/gacha-model';
import { PlayerEvents, ReceivedDropNotification } from '../models/player-model';
import './GachaMachine.scss';
import { WibbleDropModal } from './WibbleDropModal';

let dialTimer: number|undefined = undefined;

export function GachaMachine() {
  const gachaModel = React.useContext(GachaModelContext);
  const playerModel = React.useContext(PlayerContext);

  const [credits, setCredits] = React.useState<number>(playerModel.Credits());
  const [notifications, setNotifications] = React.useState<ReceivedDropNotification[]>(playerModel.receivedDropNotifications);

  React.useEffect(() => {
    playerModel.AddListener('GachaMachine', (eventName, data) => {
      if(eventName === PlayerEvents.AddCredits || eventName === PlayerEvents.PayCredits) {
        setCredits(playerModel.Credits());
      }
      else {
        setNotifications([...playerModel.receivedDropNotifications]);
      }
    });
  });

  const onDialPress = () => {
    dialTimer = setTimeout(() => {
      gachaModel?.PerformRollAll();
    }, 2500);
  }

  const onDialRelease = () => {     
    clearTimeout(dialTimer); 
  }

  const info = (
    <ul>
      <li>Click on Credits to insert cans</li>
      <li>Hold down on the dial to spend credits</li>
      <li>Press the Collection button to see your collection of Wibbles</li>
    </ul>
  )

  return (
    <div className={`gacha-machine`}>
      <div className="machine">
        <div className="dial"  onPointerDown={onDialPress} onPointerUp={onDialRelease}></div>
        <div className="slot"></div>
        <div className="credits" onClick={() => gachaModel?.AddCredits(1)}>
          <div className="credits--label">{credits}</div>
        </div>
        <div className="title-plate">
          <h1 className="title-plate--label">Wibble Gacha</h1>
        </div>
        <Tooltip content={info}>
          <div className="info-button">i</div>
        </Tooltip>
        <div className='lights'>
          <div className={`orb ${credits > 0 ? 'on' : 'off'}`}></div>
          <div className={`orb ${credits >= PITY_THRESHOLD_4STAR ? 'on' : 'off'}`}></div>
          <div className={`orb ${credits >= PITY_THRESHOLD_5STAR ? 'on' : 'off'}`}></div>
        </div>
      </div>      
      <WibbleDropModal notifications={notifications} />
    </div>
  );
}