import { AttributeContribution } from "./AttributeContribution";
import { User } from "./User";

export class Equipment {
    constructor(
      public id: string,
      public name: string,
      public bonusAttributes: AttributeContribution[]
    ) {}
  
    equip(user: User): void {
      // Implementação futura
    }
  }
  