import * as React from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { PlayerContext } from '../contexts/player-context';
import { GachaModelContext } from '../contexts/gacha-context';
import { DropInfo } from '../models/drops'
import { PlayerDropInfo } from '../models/player-model';
import "./Album.scss";

interface AlbumInfo {
  tableInfo: DropInfo;
  playerInfo: PlayerDropInfo;
}

export const Album = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const playerModel = React.useContext(PlayerContext);
  const gachaModel = React.useContext(GachaModelContext);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const allWibbles: AlbumInfo[] = gachaModel?.GetAllDrops().map(tableInfo => {
    return {
      tableInfo,
      playerInfo: playerModel.drops[tableInfo.id]
    }
  }) || [];

  console.log("All Wibbles", allWibbles);

  return (
    <>
      <Button onClick={openDialog}>Album</Button>
      <Dialog title="Album" isOpen={isOpen} canOutsideClickClose={true} onClose={closeDialog}>
        <div className="album grid">
          { allWibbles.map(x => <AlbumItem info={x}/>)}
        </div>
      </Dialog>
    </>
  );
}

const AlbumItem = (props: {info: AlbumInfo}) => {
  const {info} = props;
  const {tableInfo, playerInfo} = info;

  const hasAny = Boolean(playerInfo?.totalReceived);

  const firstReceived = playerInfo?.firstReceived;
  let dateString = "Never";
  if(firstReceived && firstReceived > 0) {
    const date = new Date(firstReceived);
    dateString = date.toDateString();
  }

  return <div className="grid-item">
    <div className="container">
      <div className="row title-row">
        <div className="title">
          {hasAny? tableInfo.name : '???'}
        </div>
      </div>
      {playerInfo && (
        <div className="row stats-row">
          <div className="stats">
            <span>Total: {playerInfo.totalReceived}</span>
            <span>First: {dateString}</span>
          </div>
        </div>
      )}
    </div>
  </div>
}