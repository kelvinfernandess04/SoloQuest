import { User } from "./User";

export class Reward {
    constructor(public type: "moeda" | "XP" | "item", public value: number) {}
  
    applyReward(user: User): void {
      // Implementação futura
    }
  }
  