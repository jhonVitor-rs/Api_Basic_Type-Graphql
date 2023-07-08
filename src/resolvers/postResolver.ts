import { Arg, Ctx, FieldResolver, Mutation, PubSub, Query, Resolver, Root } from "type-graphql";
import { PubSubEngine } from "graphql-subscriptions";
import { Posts, User as PrismaUser } from "@prisma/client";
import { Post } from "../dtos/models/postModels";
import { Context } from "../prisma.context";
import { CreatePostInput } from "../dtos/inputs/createPostInput";
import { User } from "../dtos/models/userModel";

@Resolver(() => Post)
export class PostResolver{
  @Query(() => [Post])
  async getPosts(@Ctx() ctx:Context): Promise<Posts[] | null>{
    const posts = await ctx.prisma.posts.findMany()
    return posts
  }

  @Query(() => Post)
  async getPost(
    @Arg('id') id:string,
    @Ctx() ctx: Context
  ): Promise<Posts | null>{
    const post = await ctx.prisma.posts.findUnique({where: {id}})
    return post
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('data') data: CreatePostInput,
    @Ctx() ctx: Context,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Posts | null>{
    const post = await ctx.prisma.posts.create({
      data
    })
    await pubSub.publish("NEW_POST", post)
    return post
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg('id') id: string,
    @Arg('data') data: CreatePostInput,
    @Ctx() ctx: Context
  ): Promise<Posts | null>{
    const post = await ctx.prisma.posts.update({
      where: { id },
      data,
    })
    return post
  }

  @Mutation(() => Post)
  async deletePost(
    @Arg('id') id: string,
    @Ctx() ctx: Context
  ): Promise<Posts | null>{
    const post = await ctx.prisma.posts.delete({
      where: { id },
    })

    return post
  }

  @FieldResolver(() => User, {nullable: true})
  async author(
    @Root() post: Post,
    @Ctx() ctx: Context
  ):Promise<PrismaUser | null>{
    if (!post || !post.authorId) {
      return null;
    }

    const authorPost = await ctx.prisma.user.findUnique({
      where: {id: post.authorId}
    })
    return authorPost
  }
}