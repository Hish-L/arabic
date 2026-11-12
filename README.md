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

To create the requested new private repository from your Mac Terminal:

```sh
gh auth login
npm run publish:github
```

The helper validates tests and the static build, initializes Git, commits source and saved audio, creates a private `arabic` repository on the authenticated account, enables Pages with Actions, and pushes main. It stops if an origin remote already exists and never changes the repository to public. Generated builds, dependencies, environment files, and local ZIP archives are excluded. The original single-file prototype remains in index.html for reference; Pages deploys the exported out/ directory.

Pages from private repositories requires an eligible paid GitHub plan. A private source repository does not make the published Pages website private. If Pages cannot be enabled, the helper still pushes the private repository and reports the deployment blocker.

Future pushes to main run tests, export the site, and deploy through `.github/workflows/pages.yml`. Commit the four files in `public/audio` so deployed playback does not rely on browser speech.

## Letter forms

The Forms link in the app bar opens `/forms/` (or `/arabic/forms/` on GitHub Pages). Switch between Seen and Sheen to see beginning, middle, ending, and standalone shapes, with illustrated hands indicating joining directions. The optional fatḥa switch preserves the correct joining shapes. A parent note explains that some preceding letters do not connect.
