import { PlayerModel } from './player-model';
import { DropInfo, DropRate } from './drops';

export const PITY_THRESHOLD_5STAR = 25;
export const PITY_THRESHOLD_4STAR = 10;

export class GachaModel {

  private player:PlayerModel;
  private dropRates: DropRate[];
  private dropTable: DropInfo[];

  public constructor(player: PlayerModel, dropRates: DropRate[], dropTable: DropInfo[]) { 
    this.player = player;
    this.dropRates = dropRates;
    this.dropTable = dropTable;
  }

  public GetAllDrops(): DropInfo[] {
    return this.dropTable;
  }

  public AddCredits(amount: number) { 
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

    if(this.player.Credits() >= amount) {

      let actualAmount = amount;
      let pity = amount;

      const guaranteed5Stars = Math.floor(amount / PITY_THRESHOLD_5STAR);
      actualAmount -= guaranteed5Stars;
      pity -=  guaranteed5Stars * PITY_THRESHOLD_5STAR;
      
      const guaranteed4Stars = Math.floor(pity / PITY_THRESHOLD_4STAR);
      actualAmount -= guaranteed5Stars;

      const spec4 = this.RollResults(guaranteed4Stars, 4);
      const spec5 = this.RollResults(guaranteed5Stars, 5);
      const normal = this.RollResults(actualAmount);

      const results: DropInfo[] = [
        ...normal,
        ...spec4,
        ...spec5,
      ];
            
      this.player.PayCredits(amount);
      this.player.ReceiveDrops(results);
    }
  }

  public PerformRollAll() {
    this.PerformRoll(this.player.Credits());
  }

  RollResults(amount: number, rarity: number = 0): DropInfo[] {
    const results: DropInfo[] = [];
    for(let x = 0; x < amount; ++x) {
      results.push(this.RollResult(rarity))
    }
    return results;
  }

  RollResult(rarity: number = 0): DropInfo {
    const roll = Math.random() * 100;
    const tier = rarity || this.GetTierForRoll(roll);
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