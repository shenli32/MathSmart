After each save point, push it to GitHub.
OpenAI model with “luna” in its name: gpt-5.6-luna
The AI key comes from getKey().
Saves on this computer only for now.

## How to run
Run `./start.sh`, then open http://127.0.0.1:3000 in a browser.

## What’s done
- Version 1: voice math questions, spoken answers, small-step explanations, and practice problems.
- The AI key stays on the server and is loaded only through `getKey()`.
- Browser progress uses localStorage.

## Maybe Later
- Type a problem when talking out loud does not work.
- Hear a hint before seeing the full answer.
- Report a wrong or unkind answer.
- Check the answer a second way.
- Pick a math topic.
- See how many practice problems were correct.
- Hear the answer again more slowly.
- See a picture model, like grouped dots.

## What’s next
- Test the voice flow with elementary students and improve explanations from their feedback.

Start command: `./start.sh`

## Vercel
The page stays in `public/`, and Vercel runs `api/ask.js` as the small server function. It reuses the server-only `getKey()` helper, so the MindDo token and AI key stay off the page. Browser saving still uses localStorage.

To put it online, import this GitHub repository into Vercel and set these Project Environment Variables:
- `KEYGEN_URL`
- `KEYGEN_TOKEN`

No other Vercel setting is required. The Vercel project should use the repository root and the included `vercel.json`; Vercel will use its built-in Node.js runtime for `api/ask.js`.

## MathSmart static website
The front page is now MathSmart: a kid-friendly Tamagotchi-style pet game with a math helper in `public/`. It uses only HTML, CSS, and JavaScript. The root `index.html` opens the game for GitHub Pages. The pet name, pet type, coins, happiness, and energy are saved in the browser with localStorage. No library or build tool is needed for the pet game.

The MathSmart page includes a voice helper. It uses the browser microphone and speech synthesis, and sends the question to the server-only `/api/ask` route so the AI key stays off the page. The typing box is the fallback when voice input is unavailable. Pet artwork is CSS-drawn, with no emoji characters.
