import { LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";
import { useOptionalAdminUser } from "~/utils";


type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>
}

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json<LoaderData>({ posts });
};

export default function PostsRoute() {
  const { posts } = useLoaderData() as LoaderData;
  const adminUser = useOptionalAdminUser();

  return(
    <main>
      <h1> Posts</h1>
      {adminUser && 
        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>
      }
      
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              prefetch="intent"
              className="text-blue-600 underline"
              >
                {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}