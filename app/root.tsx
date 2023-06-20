import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { createHead } from 'remix-island';

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import { getEnv } from "./env.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  ENV: ReturnType<typeof getEnv>,
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json<LoaderData>({ 
    user: await getUser(request),
    ENV: getEnv(),
  });
};

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
  </>
));

export default function App() {
  const data = useLoaderData();
  return (
    <>
      <Head />
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      {/* This is the inline script tag */}
      <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
      <LiveReload />
    </>
  );
}
