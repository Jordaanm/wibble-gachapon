import { ChangeListener } from "./change-listener";
import { DropInfo } from "./drops";

export const STARTING_CANS = 24;
export const NEW_CAN_PERIOD = 3600;

export interface PlayerDropInfo {
  id: string;
  firstReceived: number;
  totalReceived: number;
}

export interface PlayerSave {
  drops: PlayerDropInfo[];
  inventory: {[key: string]: number}
  credits: number;
  cans: number;
  lastLogin: number;
}

export enum PlayerEvents {
  AddCredits = "AddCredits",
  PayCredits = "PayCredits",
  ReceiveWibble = "ReceiveWibble",
  ClearNotifications = "ClearNotifications",
  ViewNotification = "ViewNotification",
  AddCans = "AddCans",
  NewGame = "NewGame",
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
  cans: number;
  lastLogin: number;

  private listeners: {[key: string]: ChangeListener<PlayerModel>}= {};

  constructor() {
    this.drops = {};
    this.inventory = {};
    this.credits = 0;
    this.cans = 0;
    this.lastLogin = 0;
  }

  public AddListener(name: string, listener: ChangeListener<PlayerModel>): void {
    this.listeners[name] = listener;
  }

  public Publish(eventName: string) {
    Object.values(this.listeners).forEach(listener => listener(eventName, this));
  }


  public BuildSaveState(): PlayerSave {
    const { inventory, credits, drops, cans, lastLogin } = this;
    return {
      drops: Object.values(drops),
      inventory,
      credits,
      cans,
      lastLogin
    }
  }

  private Save() {
    const data = this.BuildSaveState();
    localStorage.setItem('player', JSON.stringify(data));
  }

  public Load() {
    const json = localStorage.getItem('player');
    const currentTime = this.getTimestamp();
    if(json) {
      const playerState = JSON.parse(json);
      this.LoadFromState(playerState, currentTime);
    } else {
      // New Game
      this.NewGame();
    }
  }

  private NewGame() {
    this.lastLogin = this.getTimestamp();
    this.cans = STARTING_CANS;
    this.Save();
    this.Publish(PlayerEvents.NewGame);
  }

  private getTimestamp(): number {
    return (new Date()).getTime();
  }

  public LoadFromState(state: PlayerSave, currentTime: number) {
    const {drops, inventory, credits, cans, lastLogin} = state;
    this.inventory = inventory;
    this.credits = credits;
    this.cans = cans;
    this.lastLogin = lastLogin;
    this.drops = drops.reduce((obj, drop) => {
      obj[drop.id] = drop;
      return obj;
    }, {} as {[key: string]: PlayerDropInfo});

    this.onLogin(currentTime, lastLogin);
  }

  public onLogin(currentTime: number, lastLogin: number) {
    const currentTick = Math.floor(currentTime / NEW_CAN_PERIOD)
    const prevTick = Math.floor(lastLogin / NEW_CAN_PERIOD);
    const newCans = currentTick - prevTick;

    this.AddCans(newCans);
  }

  private AddCans(amount: number) {
    this.cans += amount;
    this.lastLogin = this.getTimestamp();
    this.Publish(PlayerEvents.AddCans)
  }

  public AddCredits(amount: number) { 
    if(this.cans < amount) { return; }
    this.credits += amount;
    this.cans -= amount;
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

    this.receivedDropNotifications.push(notif);
    this.Save();
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