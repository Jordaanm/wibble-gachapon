import { Button, Dialog } from '@blueprintjs/core';
import * as React from 'react';
import { GachaModelContext } from '../contexts/gacha-context';
import { PlayerContext } from '../contexts/player-context';


type RefundInfo = {[key: string]: number};
const AllRefunds: RefundInfo = {  
  'Oct2022': 25
}

export const Refunds = () => {
  const gachaModel = React.useContext(GachaModelContext);
  const playerModel = React.useContext(PlayerContext);

  const [unclaimedRefunds, setUnclaimedRefunds] = React.useState<number>(0);
  const [ignore, setIgnore] = React.useState<boolean>(false);
  React.useEffect(() => {

    const claimedRefunds = loadClaimedRefunds();
    const unclaimed = getUnclaimedRefunds(claimedRefunds);
    const total = getTotalRefunds(unclaimed);
    setUnclaimedRefunds(total);

    return () => {};
  })

  const claimAll = () => {
    const allKeys = Object.keys(AllRefunds);
    playerModel.ReceiveRefund(unclaimedRefunds);
    setUnclaimedRefunds(0);
    saveClaimedRefunds(allKeys); 
  }

  const shouldShow = unclaimedRefunds > 0 && !ignore;

  return ( 
    <>
      <Dialog title="Your Claim Has Been Approved" isOpen={shouldShow} onClose={() => setIgnore(true)}>
        <>
          <p>You were overcharged, and your refund claim has been approved</p>
          <p>Press the Claim button below to receive missing stinky fish (plus a few extra, to say sorry)</p>
          <Button onClick={claimAll}>Claim your {unclaimedRefunds} stinky fish cans!</Button>
        </>
      </Dialog>
    </>
  );
}

const loadClaimedRefunds = (): string[] => {
  const json = localStorage.getItem('refunds');
  if(json) {
    const refunds = JSON.parse(json);
    return refunds.claimed;
  } else {
    return []
  }
};

const saveClaimedRefunds = (claimed: string[]): void => {
  localStorage.setItem('refunds', JSON.stringify({claimed}));
}

const getUnclaimedRefunds = (claimedRefunds: string[]): RefundInfo => {
  return Object.keys(AllRefunds).reduce((obj, key) => { 
    if(!claimedRefunds.includes(key)) {
      obj[key] = AllRefunds[key];
    }

    return obj;
  }, {} as RefundInfo);
};

const getTotalRefunds = (unclaimed: RefundInfo): number => {
  return Object.values(unclaimed).reduce(
    (total, val) => total + val,
    0
  );
}