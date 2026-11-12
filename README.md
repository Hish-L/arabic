# Seen & Sheen

A colourful Next.js, React, and Tailwind game for five-year-olds: learn س and ش, practise fatḥa (سَ / شَ), find letters, and add Sheen’s three dots.

## Preview

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000 in Chrome. Dependencies are already installed in the original workspace.

## Listen & find

The 🎧 Find tab plays Seen or Sheen and displays five shuffled letters: the target plus four unique distractors from the remaining Arabic alphabet. Each six-round game has three Seen and three Sheen prompts. Replay audio with Listen; wrong answers allow retries without revealing the target name. The global fatḥa switch applies immediately in every activity without resetting quiz progress. Colour follows position, not letter identity.

## Sound

Chrome pronunciation has been confirmed by the user; Firefox speech is silent on their setup. Letter buttons no longer play a misleading tap sound. Reward sounds remain.

The game prefers optional saved WAV clips. When absent, it uses browser speech, preferring Arabic and falling back to English/default voices. English approximations are “seen,” “sheen,” “sah,” and “shah.” No GPT service or API key is used.

For browser-independent playback, run this once in your own Mac Terminal:

```sh
npm run audio:setup
```

This generates four files using the Mac's built-in Samantha voice in public/audio. It checks that every WAV contains non-silent PCM data. The managed agent environment blocks voice export; no successful recordings have been generated there. Reload the game after successful generation. Include public/audio when deploying. The setup is optional and does not block npm run dev.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

The managed creation environment blocks localhost servers with EPERM. A production build can be validated there, but a live preview must be started from the user's terminal.

## Fatḥa, dots, and tracing

The menu fatḥa switch updates visible letters and the current unanswered quiz prompt immediately. In the dot activity, filled dots stay in their positions, fast taps are preserved, and Again resets the activity. Trace opens a full-viewport practice area with one rounded handwriting guide at a time. Use a finger, stylus, or mouse to draw; Clear removes strokes, Next switches between Seen and Sheen, and Back returns to Listen. Fatḥa is available in the tracing toolbar; changing it clears the drawing for the new guide. Tracing is free practice, without automatic handwriting scoring.

## GitHub Pages

`npm run build:pages` exports the site to `out/` using the `/arabic` base path. JavaScript, CSS, home links, and saved audio use that path. Normal `npm run dev` stays at `/`.

The public repository is [Hish-L/arabic](https://github.com/Hish-L/arabic), and the site is hosted at [hish-l.github.io/arabic](https://hish-l.github.io/arabic/). GitHub Pages uses GitHub Actions as its deployment source.

To publish changes:

```sh
git add .
git commit -m "Update Arabic learning game"
git push origin main
```

Pushes to `main` run tests, export the site, and deploy through `.github/workflows/pages.yml`. The four recordings in `public/audio` are included in Git and deployed with the site. Generated builds, dependencies, environment files, and local ZIP archives are excluded. The original single-file prototype remains in `index.html` for reference; Pages deploys the exported `out/` directory.

The repository is public because the current GitHub plan requires it for Pages hosting. The `publish:github` helper is only for creating a new private repository on an account with an eligible Pages plan; it stops when an `origin` remote already exists.

## Letter forms

The Forms link in the app bar opens `/forms/` (or `/arabic/forms/` on GitHub Pages). Switch between Seen and Sheen to see beginning, middle, ending, and standalone shapes, with illustrated hands indicating joining directions. The optional fatḥa switch preserves the correct joining shapes. A parent note explains that some preceding letters do not connect.
