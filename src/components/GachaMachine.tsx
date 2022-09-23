import * as React from 'react';
import { GachaModelContext } from '../contexts/gacha-context';
import { PlayerContext } from '../contexts/player-context';
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
      <WibbleDropModal notifications={notifications} />
    </div>
  );
}