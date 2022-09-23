import React from "react";
import { GachaLoader } from "../contexts/gacha-context";
import { DropInfo, DropRarity, DropRate, DropType } from "../models/drops";
import { SheetDataLoader } from "./sheet-data-loader";


export interface GachaData {
  dropInfo: DropInfo[];
  dropRates: DropRate[];
}

const dataMapper = (rawSheetData: any[]): GachaData => {
  const dropRates = rawSheetData.find(x => x.id === "DropRates")?.data.map((x: any): DropRate => {
    return {
      rarity: Number.parseInt(x.Rarity, 10),
      rate: Number.parseFloat(x['Drop Rate'])
    };
  });

  const dropInfo = rawSheetData.find(x => x.id === "Drops")?.data.map((x: any): DropInfo => {
    return {
      id: x.ID,
      name: x.Name,
      type: x.Type,
      rarity: Number.parseInt(x.Rarity, 10),
      description: x.Description,
      image: ''
    }
  });

  return {
    dropInfo,
    dropRates,
  }
}

interface GachaDataLoaderProps {
  children: React.ReactNode|undefined
}

export const GachaDataLoader = (props: GachaDataLoaderProps) => {
  const { children } = props;
  return <SheetDataLoader<GachaData> processData={dataMapper} render={ (gachaData) => {
    return <GachaLoader data={gachaData} children={children} />
  }} />;
}