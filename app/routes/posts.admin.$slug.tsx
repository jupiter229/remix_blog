import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createPost, getPost, updatePost } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminUser(request);
  if (params.slug === 'new') {
    return json({});
  }
  const post = await getPost(params.slug);
  return json({ post });
}

export const action: ActionFunction = async ({ request, params }) => {
  
  await requireAdminUser(request);
  const formData = await request.formData();

  const title = formData.get('title');
  const slug =  formData.get('slug');
  const markdown =  formData.get('markdown');

  const errors = {
    title: title ? null : "Title is required",
    slug: title ? null : "Slug is required",
    markdown: title ? null : "Markdown is required",
  }

  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  
  if(hasErrors) {
    return json(errors);
  }

  invariant(
    typeof title === "string",
    "title must be a string"
  );

  invariant(
    typeof slug === "string",
    "slug must be a string"
  );
  
  invariant(
    typeof markdown === "string",
    "markdown must be a string"
  );

  if (params.slug === "new") {
    await createPost({title, slug, markdown});
  } else {
    await updatePost(params.slug, {title, slug, markdown})
  }
  

  return redirect("/posts/admin");
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function NewPost() {
  const data = useLoaderData();
  const errors = useActionData<typeof action>();
  
  const navigation = useNavigation();

  const isCreating = navigation.formData?.get("intent") === "create";
  const isUpdating = navigation.formData?.get("intent") === "update";
  const isNewPost = !data.post;

  console.log('navigation.formData?.get("intent") ', navigation.formData?.get("intent"))
  console.log('isUpdating ', isUpdating)

  return (
    <Form method="post" key={data.post?.slug ?? "new"}>
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={data.post?.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ): null }
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={data.post?.slug}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown: {" "} 
          {errors?.markdown ? (
            <em className="text-red-600">
              {errors.markdown}
            </em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
          defaultValue={data.post?.markdown}
        />
      </p>
      <p className="text-right">
        <button
          name="intent"
          type="submit"
          value={isNewPost ? "create": "update"}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating || isUpdating}
        >
          {isNewPost ? (isCreating ? "Creating..." : "Create Post"): null}
          {isNewPost ? null: (isUpdating ? "Updating..." : "Update") }
          
        </button>
      </p>
    </Form>
  );

}