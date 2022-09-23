import { Dialog, ButtonProps, DialogStep, MultistepDialog } from '@blueprintjs/core';
import * as React from 'react';
import { PlayerContext } from '../contexts/player-context';
import { PlayerEvents, PlayerModel, ReceivedDropNotification } from '../models/player-model';
import { AnimatedBackground } from './animated-background';
import "./drop-step.scss";

interface WibbleDropModalProps {
  notifications: ReceivedDropNotification[];
}

export const WibbleDropModal = (props: WibbleDropModalProps) => {
  const playerModel: PlayerModel = React.useContext(PlayerContext);
  const { notifications } = props;

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

  return <MultistepDialog 
    className="received-drop-modal" 
    icon="info-sign" 
    navigationPosition="left" 
    canOutsideClickClose={false}
    onClose={onClose}
    finalButtonProps={finalButtonProps}
    title="More Wibbles!"
    isOpen={notifications.length > 0}
    onChange={onChange}
  >
    {notifications.map((notif, i) => WibbleDropStep(notif, i))}
  </MultistepDialog>
};

const WibbleDropStep = (notification: ReceivedDropNotification, index: number) => {

  const { name, description, id, rarity, type, image} = notification.dropInfo;

  const panel = (
    <div className="drop-step-panel">
      <AnimatedBackground />
      <div className="content">
        <div className="title-row row">
          <span className='title'>{name}</span>
          {notification.isNew && <span className='badge new-drop'>NEW!</span>}
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
    </div>
  );

  return <DialogStep
    key={`dialog-step-${index}-${id}`}
    id={`step-${index}`}
    panel={panel}
    title={notification.viewed || index == 0 ? name : '???'}
  />
}