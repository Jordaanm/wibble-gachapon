import { PlayerModel } from './player-model';
import { DropInfo, DropRate } from './drops';

export class GachaModel {

  private player:PlayerModel;
  private dropRates: DropRate[];
  private dropTable: DropInfo[];

  public constructor(player: PlayerModel, dropRates: DropRate[], dropTable: DropInfo[]) { 
    this.player = player;
    this.dropRates = dropRates;
    this.dropTable = dropTable;
  }

  public AddCredits(amount: number) { 
    console.log("GachaModel::AddCredits", amount, this.player);
    if(!this.EnsurePlayer()) { return; }

    this.player.AddCredits(amount);
  }

  public EnsurePlayer(): boolean {
    if(this.player) { return true; }
    console.error("Attempted to call GachaMachine method with no Player set");
    return false;
  }

  public PerformRoll(amount: number) {
    if(!this.EnsurePlayer()) { return; }

    console.log("GachaModel::PerformRoll", amount, this.player);
    if(this.player.Credits() >= amount) {
      
      const results: DropInfo[] = this.RollResults(amount);
      
      this.player.ReceiveDrops(results);
      this.player.PayCredits(amount);
    }
  }

  RollResults(amount: number): DropInfo[] {
    const results: DropInfo[] = [];
    for(let x = 0; x < amount; ++x) {
      results.push(this.RollResult())
    }
    return results;
  }

  RollResult(): DropInfo {
    const roll = Math.random() * 100;
    const tier = this.GetTierForRoll(roll);
    const result = this.GetRandomFromTier(tier);

    return result;
  }

  GetTierForRoll(roll: number) {
    if(roll > 99.9) { return 5;}
    if(roll > 99) { return 4; }
    if(roll > 80) { return 3; }
    if(roll > 50) { return 2; }
    return 1;
  }

  GetRandomFromTier(tier: number): DropInfo {
    const allOfTier = this.dropTable.filter(x => x.rarity === tier);
    const index = Math.floor(Math.random() * allOfTier.length);
    return allOfTier[index];
  }
}