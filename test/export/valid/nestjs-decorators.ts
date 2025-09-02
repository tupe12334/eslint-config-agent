// Valid: NestJS decorators with exported classes
import { Resolver, Mutation, Args, Query, Parent, ResolveField } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';

interface User {
  id: string;
}

interface CreateUserInput {
  name: string;
}

@Resolver(() => String)  
export class UserResolver {

  @Query(() => [String])
  async users(): Promise<string[]> {
    return ['user1', 'user2'];
  }

  @Mutation(() => String)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<string> {
    return `Created user: ${input.name}`;
  }

  @ResolveField('posts', () => [String])
  async getPosts(@Parent() user: User) {
    return [`post for ${user.id}`];
  }
}