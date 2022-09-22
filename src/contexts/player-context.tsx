import * as React from 'react';
import { PlayerModel } from '../models/player-model';


export const PlayerContext = React.createContext<PlayerModel>(new PlayerModel());

export const PlayerLoader = (props: any) => {
  const { children } = props;

  const [player, setPlayer] = React.useState(new PlayerModel());

  React.useEffect(() => {
    const json = localStorage.getItem('player');
    if(json) {
      const playerState = JSON.parse(json);
      player.LoadFromState(playerState);
    }
  });

  return <PlayerContext.Provider value={player}>
    {children}
  </PlayerContext.Provider>
}