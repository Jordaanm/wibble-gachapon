import { ChangeListener } from "./change-listener";
import { DropInfo } from "./drops";

export interface PlayerDropInfo {
  id: string;
  firstReceived: number;
  totalReceived: number;
}

export interface PlayerSave {
  drops: PlayerDropInfo[];
  inventory: {[key: string]: number}
  credits: number;
}

export enum PlayerEvents {
  AddCredits = "AddCredits",
  PayCredits = "PayCredits",
  ReceiveWibble = "ReceiveWibble",
  ClearNotifications = "ClearNotifications",
  ViewNotification = "ViewNotification",
}

export interface ReceivedDropNotification {
  dropInfo: DropInfo;
  isNew: boolean;
  viewed: boolean;
}

export class PlayerModel {
  drops: {[key: string]: PlayerDropInfo}
  inventory: {[key: string]: number}
  credits: number;
  receivedDropNotifications: ReceivedDropNotification[] = [];

  private listeners: {[key: string]: ChangeListener<PlayerModel>}= {};

  constructor() {
    this.drops = {};
    this.inventory = {};
    this.credits = 0;
  }

  public AddListener(name: string, listener: ChangeListener<PlayerModel>): void {
    this.listeners[name] = listener;
  }

  public Publish(eventName: string) {
    Object.values(this.listeners).forEach(listener => listener(eventName, this));
  }


  public BuildSaveState(): PlayerSave {
    const { inventory, credits, drops } = this;
    return {
      drops: Object.values(drops),
      inventory,
      credits,
    }
  }

  public LoadFromState(state: PlayerSave) {
    const {drops, inventory, credits} = state;
    this.inventory = inventory;
    this.credits = credits;
    this.drops = drops.reduce((obj, drop) => {
      obj[drop.id] = drop;
      return obj;
    }, {} as {[key: string]: PlayerDropInfo});
  }

  public AddCredits(amount: number) { 
    console.log("PlayerModel::AddCredits", amount);
    this.credits += amount;
    this.Publish(PlayerEvents.AddCredits);
  }
  public Credits(): number { return this.credits };
  public PayCredits(amount: number) { 
    this.credits -= amount; 
    this.Publish(PlayerEvents.PayCredits);
  }


  public ReceiveDrops(payload: DropInfo[]) {
    payload.forEach((d) => this.ReceiveDrop(d));
  }

  public ReceiveDrop(drop: DropInfo) {
    const notif: ReceivedDropNotification = {
      dropInfo: drop,
      isNew: false,
      viewed: false
    };

    if(!this.drops[drop.id]) {
      this.drops[drop.id] = {
        id: drop.id,
        firstReceived: (new Date()).getTime(),
        totalReceived: 1 
      };
      notif.isNew = true;
    } else {
      this.drops[drop.id].totalReceived += 1;
    }

    console.log("You received a drop: " + drop.id, drop);
    this.receivedDropNotifications.push(notif);
    this.Publish(PlayerEvents.ReceiveWibble);
  }

  public ClearNotifications() {
    this.receivedDropNotifications.splice(0, this.receivedDropNotifications.length);
    this.Publish(PlayerEvents.ClearNotifications);
  }

  public ViewNotification(index: number) {
    this.receivedDropNotifications[index].viewed = true;
    this.Publish(PlayerEvents.ViewNotification);
  }
}