type Post = {
  slug: string;
  title: string;
}
import { prisma } from "~/db.server";
export async function getPosts(): Promise<Array<Post>> {
  return prisma.post.findMany();
}