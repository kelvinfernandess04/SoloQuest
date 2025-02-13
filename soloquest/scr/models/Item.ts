export class Item {
    constructor(
      public id: string,
      public name: string,
      public description: string,
      public price: number,
      public effect: string
    ) {}
  
    applyEffect(): void {
      // Implementação futura
    }
  }
  