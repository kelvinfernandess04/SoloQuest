import { AttributeContribution } from "./AttributeContribution";
import { Reward } from "./Reward";

export class Task {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public deadline: Date,
      public difficulty: "fácil" | "médio" | "difícil",
      public category: "Missão Diária" | "Dungeon" | "Chefe" | "Desafio Especial",
      public isCompleted: boolean = false,
      public rewards: Reward[] = []
    ) {}
  
    markAsCompleted(): void {
      this.isCompleted = true;
    }
  
    calculateContribution(): AttributeContribution[] {
      // Implementação futura
      return [];
    }
  }
  