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
