import * as React from 'react';
import { PlayerModel } from '../models/player-model';


export const PlayerContext = React.createContext<PlayerModel>(new PlayerModel());

export const PlayerLoader = (props: any) => {
  const { children } = props;

  const [player, setPlayer] = React.useState(new PlayerModel());

  React.useEffect(() => {
    player.Load();
  });

  return <PlayerContext.Provider value={player}>
    {children}
  </PlayerContext.Provider>
}