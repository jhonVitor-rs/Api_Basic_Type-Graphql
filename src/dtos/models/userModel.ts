import { Field, ObjectType } from "type-graphql";
import { User as PrismaUser } from "@prisma/client"
import { Post } from "./postModels";

@ObjectType()
export class User implements PrismaUser{
  @Field()
  id: string

  firstName: string;
  lastName: string;

  @Field()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Field()
  email: string

  // @Field(() => Post)
  // post: Post[]
}
