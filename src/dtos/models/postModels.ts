import { ObjectType, Field } from "type-graphql";
import { Posts } from "@prisma/client";
import { User } from "./userModel";

@ObjectType()
export class Post implements Posts {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  // @Field(() => User)
  // author: User

  @Field()
  authorId: string;
}
