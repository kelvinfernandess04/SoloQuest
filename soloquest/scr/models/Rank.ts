import { User } from "./User";

export class Rank {
    constructor(public title: string, public requiredScore: number) {}
  
    checkRank(user: User): boolean {
      return user.experience >= this.requiredScore;
    }
  }
  