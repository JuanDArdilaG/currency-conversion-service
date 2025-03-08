import { UserEmail } from "./user-email.valueobject";
import { UserID } from "./user-id.valueobject";

export class User {
  constructor(
    public id: UserID,
    public name: string,
    public email: UserEmail,
    public createdAt: Date
  ) {}

  static create(name: string, email: UserEmail): User {
    return new User(UserID.generate(), name, email, new Date());
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.value,
      name: this.name,
      email: this.email.value,
      createdAt: this.createdAt,
    };
  }
}

export type UserPrimitives = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};
