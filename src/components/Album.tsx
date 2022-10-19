import * as React from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { PlayerContext } from '../contexts/player-context';
import { GachaModelContext } from '../contexts/gacha-context';
import { DropInfo } from '../models/drops'
import { PlayerDropInfo } from '../models/player-model';
import "./Album.scss";
import { GachaModel } from '../models/gacha-model';
import gsap from 'gsap';

interface AlbumInfo {
  tableInfo: DropInfo;
  playerInfo: PlayerDropInfo;
}

export const Album = () => {

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const openDialog = () => setIsOpen(true);
  // const closeDialog = () => { setSelectedItem(null); setIsOpen(false); }
  const closeDialog = () => { setIsOpen(false); }

  return (
    <div className="album-section">
      <Button onClick={openDialog}>Collection</Button>
      <Dialog title="Your Wibble Collection" isOpen={isOpen} canOutsideClickClose={true} onClose={closeDialog} className="album-modal">
        <AlbumContent />
      </Dialog>
    </div>
  );
}

const AlbumContent = () => {

  const albumRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".grid-item", {
        duration: 0.1,
        scale: 0.8,
        force3D: true
      }, {
        scale: 1,
        duration: .1,
        stagger: 0.05,
        ease: "elastic", 
        force3D: true        
      });

    }, albumRef)
    return () => ctx.revert();
  }, []);

  const playerModel = React.useContext(PlayerContext);
  const gachaModel = React.useContext(GachaModelContext);

  const allWibbles: AlbumInfo[] = (gachaModel?.GetAllDrops().map(tableInfo => {
    return {
      tableInfo,
      playerInfo: playerModel.drops[tableInfo.id]
    }
  }) || []).sort((a,b) => a.tableInfo.rarity - b.tableInfo.rarity);

  const [selectedItem, setSelectedItem] = React.useState<AlbumInfo|null>(null);

  return (
    <div className="album-modal-layout">
      <div className="album" ref={albumRef}>
        { allWibbles.map(x => <AlbumItem key={x.tableInfo.id} info={x} select={setSelectedItem}/>)}
      </div>
      <div className="details">
        {selectedItem && (
          <AlbumInfoView info={selectedItem} key={selectedItem.tableInfo.id}/>
        )}
        {!selectedItem && <AlbumLanding gachaModel={gachaModel} allWibbles={allWibbles} />}
      </div>
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
  });

  const perType = ["Wibble","Tiny Wib","Wibblet","Other"].map(type => {
    const wibblesOfType = allWibbles.filter(x => x?.tableInfo.type === type);
    const unlocked = wibblesOfType.filter(x => x?.playerInfo?.firstReceived).length;

    return {
      type,
      unlocked,
      total: wibblesOfType.length
    }
  });

  return (
    <div className="album-landing">
      <span className='message'>You have unlocked {unlockedWibbles}/{totalWibbles}</span>
      {perRarity.map(x => 
        <span className='message'>
          <span className={`rarity rarity-${x.rarity}`}></span>
          {x.unlocked}/{x.total}
        </span>
      )}
      {perType.map(x => 
      <span className="message">
        <span className={`type type-${x.type.toLowerCase()}`}>{x.type}:</span>
        {x.unlocked}/{x.total}
      </span>
      )}
    </div>
  );
};

const AlbumInfoView = (props: {info: AlbumInfo}) => {
  const {info} = props;
  const { playerInfo, tableInfo} = info;
  const { name, rarity, description, type, id } = tableInfo;

  const panelRef = React.useRef(null);
  const timeline = React.useRef<gsap.core.Timeline>(); 

  
  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if(timeline.current) {
        timeline.current.progress(0).kill();
      }

      timeline.current = gsap.timeline();

      timeline.current
      .to('.type-row, .description-row', {
        duration: 0,
        opacity: 0,
        x: -100
      })
      .to('.rarity-row', {
        duration: 0,
        y: 1000,
        delay: 0
      })
      .to('.rarity-row-icon', {
        duration: 0,
        opacity: 0,
        delay: 0
      })
      .to('.title', {
        duration: 0,
        y: -100,
        delay: 0.0
      })
      .to('.title', {
        duration: 0.3,
        y: 0,
      })
      .to('.rarity-row', {
        duration: 0.3,
        y: 0,
        delay: 0
      })
      .to('.type-row', {
        duration: 0.2,
        opacity: 1,
        x: 0
      })
      .to('.description-row', {
        duration: 0.2,
        opacity: 1,
        x: 0
      })
      .to('.rarity-row-icon', {
        duration: 0.2,
        scale: 1.5,
        stagger: 0.1,
        opacity: 1,
        delay: 0.3
      }).to('.rarity-row-icon', {
        duration: 0.2,
        scale: 1.0,
        stagger: 0.1,
        delay: 0.0
      });
    }, panelRef);
    return () => { ctx.revert();}
  }, []);

  const firstReceived = playerInfo?.firstReceived;
  let dateString = "Never";
  if(firstReceived && firstReceived > 0) {
    const date = new Date(firstReceived);
    dateString = date.toDateString();
  } else {
    return <h2>???</h2>
  }

  const r = new Array(rarity).fill('☆')

  return (
    <div className='album-info' key={id}>
      <div className="content" ref={panelRef}>
        <div className="title-row row">
          <span className='title'>{name}</span>
        </div>
        <div className="rarity-row row">
          <span className={`rarity rarity-${rarity}`}>
            {r.map((x, i) => <span key={i} className="rarity-row-icon">{x}</span>)}
          </span>
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