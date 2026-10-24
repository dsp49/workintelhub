/**
 * Worker entry point.
 *
 * This project is a Worker with static assets, not a Pages project. That
 * distinction matters: a `functions/` directory is a Pages convention and is
 * never executed here, which is why /api/subscribe answered 404 for months
 * while every static page served correctly.
 *
 * So the routing Pages would have done by filename is done explicitly below.
 * The handlers themselves are unchanged and still live in functions/, because
 * they are ordinary code and there is no reason to duplicate them; they are
 * bundled into this Worker at build time rather than served as files.
 *
 * Everything that is not an API route falls through to the static assets,
 * which is the whole rest of the site.
 */

import { onRequest as subscribe } from "../functions/api/subscribe.js";
import { onRequest as subscribers } from "../functions/api/subscribers.js";

const ROUTES = {
  "/api/subscribe": subscribe,
  "/api/subscribers": subscribers,
};

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);

    const handler = ROUTES[pathname];
    if (handler) {
      try {
        return await handler({ request, env, ctx });
      } catch (err) {
        // A handler that throws would otherwise surface as a bare 1101 page.
        // Log it and answer in the same shape the handlers use, so the form's
        // error path still gets JSON it can read.
        console.error("unhandled error in", pathname, err && err.stack);
        return new Response(
          JSON.stringify({ ok: false, error: "Something went wrong." }),
          {
            status: 500,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "no-store",
            },
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
