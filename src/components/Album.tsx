import * as React from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { PlayerContext } from '../contexts/player-context';
import { GachaModelContext } from '../contexts/gacha-context';
import { DropInfo } from '../models/drops'
import { PlayerDropInfo } from '../models/player-model';
import "./Album.scss";
import { GachaModel } from '../models/gacha-model';

interface AlbumInfo {
  tableInfo: DropInfo;
  playerInfo: PlayerDropInfo;
}

export const Album = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<AlbumInfo|null>(null);

  const playerModel = React.useContext(PlayerContext);
  const gachaModel = React.useContext(GachaModelContext);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => { setSelectedItem(null); setIsOpen(false); }

  const allWibbles: AlbumInfo[] = gachaModel?.GetAllDrops().map(tableInfo => {
    return {
      tableInfo,
      playerInfo: playerModel.drops[tableInfo.id]
    }
  }) || [];

  return (
    <div className="album-section">
      <Button onClick={openDialog}>Collection</Button>
      <Dialog title="Your Wibble Collection" isOpen={isOpen} canOutsideClickClose={true} onClose={closeDialog} className="album-modal">
        <div className="album-modal-layout">
          <div className="album">
            { allWibbles.map(x => <AlbumItem key={x.tableInfo.id} info={x} select={setSelectedItem}/>)}
          </div>
          <div className="details">
            {selectedItem && (
              <AlbumInfoView info={selectedItem} />
            )}
            {!selectedItem && <AlbumLanding gachaModel={gachaModel} allWibbles={allWibbles} />}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

const AlbumLanding = (props: {gachaModel: GachaModel|null, allWibbles: AlbumInfo[]}) => {
  const {allWibbles, gachaModel} = props;
  const totalWibbles = allWibbles.length;
  const unlockedWibbles = allWibbles.filter(x => x?.playerInfo?.firstReceived).length;

  const perRarity = [1,2,3,4,5].map(rarity => {
    const wibblesOfRarity = allWibbles.filter(x => x?.tableInfo.rarity === rarity);
    const unlocked = wibblesOfRarity.filter(x => x?.playerInfo?.firstReceived).length;

    return {
      rarity,
      unlocked,
      total: wibblesOfRarity.length,
    }
  })

  return (
    <div className="album-landing">
      <span className='message'>You have unlocked {unlockedWibbles}/{totalWibbles}</span>
      {perRarity.map(x => 
        <span className='message'>
          <span className={`rarity rarity-${x.rarity}`}></span>
          {x.unlocked}/{x.total}
        </span>
      )}
    </div>
  );
};

const AlbumInfoView = (props: {info: AlbumInfo}) => {
  const {info} = props;
  const { playerInfo, tableInfo} = info;
  const { name, rarity, description, type } = tableInfo;

  const firstReceived = playerInfo?.firstReceived;
  let dateString = "Never";
  if(firstReceived && firstReceived > 0) {
    const date = new Date(firstReceived);
    dateString = date.toDateString();
  } else {
    return <h2>???</h2>
  }

  return (
    <div className='album-info'>
      <div className="content">
        <div className="title-row row">
          <span className='title'>{name}</span>
        </div>
        <div className="rarity-row row">
          <span className={`rarity rarity-${rarity}`}></span>
        </div>
        <div className="type-row row">
          <span className="label">Type: </span>
          <span className="type">{type}</span>
        </div>
        <div className='description-row row'>
          <p className='description'>{description}</p>
        </div>
      </div>
      {playerInfo && (
        <div className="stats">
          <span>Total: {playerInfo.totalReceived}</span>
          <span>First: {dateString}</span>
        </div>
      )}
    </div>
  )
};

const AlbumItem = (props: {info: AlbumInfo, select: (item:AlbumInfo) => void}) => {
  const {info, select} = props;
  const {tableInfo, playerInfo} = info;

  const hasAny = Boolean(playerInfo?.totalReceived);

  const firstReceived = playerInfo?.firstReceived;
  let dateString = "Never";
  if(firstReceived && firstReceived > 0) {
    const date = new Date(firstReceived);
    dateString = date.toDateString();
  }

  return <div className="grid-item" key={tableInfo.id} onClick={() => select(info)}>
    <div className="container">
      <div className="row title-row">
        <div className="title">
          {hasAny? tableInfo.name : '???'}
        </div>
      </div>
    </div>
  </div>
}