# Ramon Adedotun (@phantom)

Portfolio site. A monochrome bento grid of work, experiments and live widgets, built with Next.js, Tailwind v4 and Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3100
```

## Edit the content

Everything a visitor reads lives in `src/data.ts`. Search the project for `TODO` to find what still needs real content (links, screenshots, the CV, project details).

Images live in `public/img/`. Most are Unsplash placeholders; see `public/img/CREDITS.md`.

<<<<<<< HEAD
Add `?skipintro` to the URL to skip the boot intro (it also only plays once per browser session).

## GitHub tile

GitHub stats and the contribution graph are fetched on the server and cached for an hour, so visitors never call GitHub directly. Optionally set a `GITHUB_TOKEN` environment variable (a fine-grained token with no extra permissions is enough) to raise GitHub's API limit from 60 to 5,000 requests an hour.
=======
1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
deploy
>>>>>>> ad238fd (deploy)
