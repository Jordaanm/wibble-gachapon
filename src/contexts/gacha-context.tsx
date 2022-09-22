import * as React from 'react';
import { GachaData } from '../components/GachaSheetDataLoader';
import { GachaModel } from '../models/gacha-model';
import { PlayerModel } from '../models/player-model';
import { PlayerContext } from './player-context';

export const GachaModelContext = React.createContext<GachaModel|null>(null);

interface GachaLoaderInterface {
  data: GachaData
}

export const GachaLoader = (props: React.PropsWithChildren<GachaLoaderInterface>) => {
  const {data, children} = props;
  const playerModel: PlayerModel = React.useContext(PlayerContext);
  const {dropInfo, dropRates} = data;

  const [gachaModel] = React.useState<GachaModel>(new GachaModel(playerModel, dropRates, dropInfo));

  return <GachaModelContext.Provider value={gachaModel}>{children}</GachaModelContext.Provider>
}