import { Inventory } from "./Inventory";

export class User {
    constructor(
      public id: string,
      public name: string,
      public level: number,
      public experience: number,
      public inventory: Inventory
    ) {}
  
    levelUp(): void {
      this.level++;
      this.experience = 0;
    }
  }
  