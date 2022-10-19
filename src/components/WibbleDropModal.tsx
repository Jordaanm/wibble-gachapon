import { Dialog, ButtonProps, DialogStep, MultistepDialog } from '@blueprintjs/core';
import gsap from 'gsap';
import * as React from 'react';
import { PlayerContext } from '../contexts/player-context';
import { DropInfo } from '../models/drops';
import { PlayerEvents, PlayerModel, ReceivedDropNotification } from '../models/player-model';
import { AnimatedBackground } from './animated-background';
import "./drop-step.scss";

interface WibbleDropModalProps {
  notifications: ReceivedDropNotification[];
}

export const WibbleDropModal = (props: WibbleDropModalProps) => {
  const playerModel: PlayerModel = React.useContext(PlayerContext);
  const { notifications } = props;
  const modalRef = React.useRef(null);
  const timeline = React.useRef<gsap.core.Timeline>();

  const onClose = () => {
    playerModel.ClearNotifications();
  }

  const finalButtonProps: Partial<ButtonProps> = {
    intent: "primary",
    onClick: onClose,
    text: "Close",
  }

  const onChange = (id:string) => {
    const index = Number.parseInt(id.substring(5), 10);
    if(index && index > 0) {
      playerModel.ViewNotification(index);

    }
  }

  const onOpen = (() => {
    if(timeline.current) {
      timeline.current.progress(0).kill();
    }

    timeline.current = gsap.timeline();
    timeline.current.to(".bp4-dialog-step", {
      duration: 0.2,
      scale: 0.5,
      delay: 0.2,
      ease: "elastic", 
      force3D: true
    })
    timeline.current.to('.bp4-dialog-step', {
      duration: 0.5,
      scale: 1, 
      stagger: 0.1,
      ease: "elastic", 
      force3D: true
    })
  })

  return <MultistepDialog 
    className="received-drop-modal" 
    icon="info-sign" 
    navigationPosition="left" 
    canOutsideClickClose={false}
    onClose={onClose}
    finalButtonProps={finalButtonProps}
    title="More Wibbles!"
    isOpen={notifications.length > 0}
    onOpened={onOpen}
    onChange={onChange}
    ref={modalRef}
  >
    {notifications.map((notif, i) => WibbleDropStep(notif, i))}
  </MultistepDialog>
};

const WibbleDropStep = (notification: ReceivedDropNotification, index: number) => {

  const { name, id} = notification.dropInfo;

  const panel = (
    <div>
      <WibbleDropPanel isNew={notification.isNew} dropInfo={notification.dropInfo} key={id}/>
    </div>
  );

  return <DialogStep
    key={`dialog-step-${index}-${id}`}
    id={`step-${index}`}
    panel={panel}
    title={notification.viewed || index == 0 ? name : '???'}
  />
}

interface WibbleDropPanelProps {
  isNew: boolean;
  dropInfo: DropInfo;
}

const WibbleDropPanel = (props: WibbleDropPanelProps) => {
  const { isNew, dropInfo } = props;
  const panelRef = React.useRef(null);
  const timeline = React.useRef<gsap.core.Timeline>();
  const { name, description, id, rarity, type, image} = dropInfo;

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

  const r = new Array(rarity).fill('☆')

  return (
    <div className="drop-step-panel" ref={panelRef}>
      <AnimatedBackground />
      <div className="content">
        <div className="title-row row">
          <span className='title'>{name}</span>
          {isNew && <span className='badge new-drop'>NEW!</span>}
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
    </div>
  )
}