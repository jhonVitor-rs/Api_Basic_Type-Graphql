import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, Subscription } from "type-graphql";
import {Posts, User as PrismaUser} from "@prisma/client"
import { CreateUserInput } from "../dtos/inputs/createUserInput";
import { User } from "../dtos/models/userModel";
import { Post } from "../dtos/models/postModels";
import { Context } from "../prisma.context";

@Resolver(() => User)
export class UserResolver{
  @Query(() => [User])
  async getUsers(@Ctx() ctx: Context): Promise<PrismaUser[] | null>{
    const users = await ctx.prisma.user.findMany()
    return users
  }

  @Query(() => User)
  async getUser(
    @Arg('id') id: string,
    @Ctx() ctx: Context
  ): Promise<PrismaUser | null>{
    const user = await ctx.prisma.user.findUnique({where: {id}})
    return user
  }

  @Mutation(() => User)
  async createUser(
    @Arg('data') data: CreateUserInput,
    @Ctx() ctx: Context
  ): Promise<PrismaUser | null>{
    const user = await ctx.prisma.user.create({data})
    return user
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id') id: string,
    @Arg('data') data: CreateUserInput,
    @Ctx() ctx: Context
  ): Promise<PrismaUser | null>{
    const user = await ctx.prisma.user.update({
      where: { id },
      data,
    })
    return user
  }

  @Mutation(() => User)
  async deleteUser(
    @Arg('id') id: string,
    @Ctx() ctx: Context
  ): Promise<PrismaUser | null>{
    const user = await ctx.prisma.user.delete({
      where: { id },
    });

    return user;
  }

  @FieldResolver(() => [Post])
  async postsUser(
    @Root() user: User,
    @Ctx() ctx: Context
  ): Promise<Posts[] | null>{
    const postsUser = await ctx.prisma.posts.findMany({
      where: {authorId : user.id}
    })
    return postsUser
  }

  @Subscription(() => Post, {topics: "NEW_POST"})
  async newUserPost(
    @Root() post: Post,
  ): Promise<Post | null>{
    return await Promise.resolve(post)
  }
}
