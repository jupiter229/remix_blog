type IPost = {
  slug: string;
  title: string;
}

import type { Post } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getPosts(): Promise<Array<IPost>> {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug }});
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.create({ data: post });
}

export async function updatePost(
  slug: string,
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.update({ data: post, where: { slug } });
}