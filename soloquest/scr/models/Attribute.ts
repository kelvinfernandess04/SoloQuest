export class Attribute {
    constructor(
      public name: "STR" | "AGI" | "VIT" | "INT" | "PER" | "DEX",
      public currentValue: number,
      public maxValue: number
    ) {}
  
    increaseValue(amount: number): void {
      this.currentValue = Math.min(this.currentValue + amount, this.maxValue);
    }
  
    decreaseValue(amount: number): void {
      this.currentValue = Math.max(this.currentValue - amount, 0);
    }
  }
  