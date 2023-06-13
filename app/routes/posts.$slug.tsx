import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";
import { getPost } from "~/models/post.server";

type LoaderData = {
  title: string,
  html: string
}

export const loader: LoaderFunction  = async ({ params }) => {
  const { slug } = params;
  invariant(slug, "slug is required");
  const post = await getPost(slug);
  invariant(post, "post not found")
  const html = marked(post?.markdown);
  
  return json<LoaderData>({title: post.title, html: html});
}

export default function PostRoute() {
  const { title, html } = useLoaderData();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
      <div dangerouslySetInnerHTML={{__html: html }}></div>
    </main>
  )
}