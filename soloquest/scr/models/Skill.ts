export class Skill {
    constructor(
      public id: string,
      public name: string,
      public description: string,
      public effect: string,
      public isUnlocked: boolean = false
    ) {}
  
    unlock(): void {
      this.isUnlocked = true;
    }
  }
  