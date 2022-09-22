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
}

export class PlayerModel {
  drops: {[key: string]: PlayerDropInfo}
  inventory: {[key: string]: number}
  credits: number;
  private listeners: ChangeListener<PlayerModel>[] = [];

  constructor() {
    this.drops = {};
    this.inventory = {};
    this.credits = 0;
  }

  public AddListener(listener: ChangeListener<PlayerModel>): void {
    this.listeners.push(listener);
  }

  public Publish(eventName: string) {
    this.listeners.forEach(listener => listener(eventName, this));
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

  public ReceiveDrop(wibble: DropInfo) {
    if(!this.drops[wibble.id]) {
      this.drops[wibble.id] = {
        id: wibble.id,
        firstReceived: (new Date()).getTime(),
        totalReceived: 1 
      };
    } else {
      this.drops[wibble.id].totalReceived += 1;
    }

    console.log("You received a wibble: " + wibble.id, wibble);
    this.Publish(PlayerEvents.ReceiveWibble);
  }
}