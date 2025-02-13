import { Item } from "./Item";

export class Inventory {
    constructor(public items: Item[] = []) {}
  
    addItem(item: Item): void {
      this.items.push(item);
    }
  
    removeItem(itemId: string): void {
      this.items = this.items.filter(item => item.id !== itemId);
    }
  }
  