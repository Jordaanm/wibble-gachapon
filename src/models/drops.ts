export enum DropType {
  Wibble = "Wibble",
  TinyWib = "Tiny Wib",
  Wibblet = "Wibblet"
}

export enum DropRarity {
  Common = 1,
  Uncommon = 2,
  Rare = 3,
  Epic,
  Legendary
}

export interface DropInfo {
  id: string;
  name: string;
  type: DropType;
  description: string
  rarity: DropRarity;
  image: string;
}


export interface DropRate {
  rarity: number;
  rate: number;
}

export interface DropInfo {
  name: string;
  type: DropType;
  rarity: DropRarity;
  image: string;
}