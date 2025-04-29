// services/rewardService.ts
import { Item, Quality } from './dbItemService';
import * as dbItemService from './dbItemService';

type Reward = {
  coins: number;
  xp: number;
  item?: Item;
};

const qualities: Quality[] = ['Comum', 'Raro', 'Épico', 'Lendário'];
const weights: Record<Quality, number> = {
  Comum: 50,
  Raro: 30,
  Épico: 15,
  Lendário: 5
};

function chooseQuality(): Quality {
  const total = Object.values(weights).reduce((a,b)=>a+b,0);
  let r = Math.random() * total;
  for (const q of qualities) {
    r -= weights[q];
    if (r <= 0) return q;
  }
  return 'Comum';
}

function config(points: number) {
  switch(points) {
    case 50:  return { coins: [10,20],   xp: [5,10],    chance: 0.1 };
    case 100: return { coins: [20,40],   xp: [10,25],   chance: 0.15 };
    case 500: return { coins: [50,100],  xp: [30,60],   chance: 0.25 };
    case 1000:return { coins: [100,200], xp: [80,120],  chance: 0.35 };
    case 2000:return { coins: [200,400], xp: [150,200], chance: 0.5 };
    default:  return { coins: [20,50],   xp: [10,30],   chance: 0.2 };
  }
}

export async function computeReward(points: number): Promise<Reward> {
  const cfg = config(points);
  const coins = Math.floor(Math.random() * (cfg.coins[1]-cfg.coins[0]+1)) + cfg.coins[0];
  const xp    = Math.floor(Math.random() * (cfg.xp[1]-cfg.xp[0]+1))       + cfg.xp[0];
  const reward: Reward = { coins, xp };

  if (Math.random() < cfg.chance) {
    const quality = chooseQuality();
    const categories = ['Arma','Armadura','Acessório'];
    const category = categories[Math.floor(Math.random()*categories.length)];
    const item: Item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2,5),
      name: `Item ${quality}`,
      category,
      price: Math.floor(coins/2),
      owned: true,
      quality
    };
    await dbItemService.createItem(item);
    reward.item = item;
  }

  return reward;
}
