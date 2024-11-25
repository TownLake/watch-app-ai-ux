# watch-app-ai-ux

[Ben Thompson](https://x.com/benthompson) floated an idea during a recent episode of [Sharp Tech](https://sharptech.fm/member) that one near_er_ term use for generative AI could be creating on-the-fly UI/UX for devices like wearables (Watches, AR/VR) where you lack some of the same precedent as a medium or large rectangle with windows and tabs.

I am someone who spends a lot of time thinking about how to [use my phone less](https://blog.samrhea.com/posts/2024/phone-hour/) and this idea appealed to me. So I decided to see if I could prototype it.

## What is it?

The Watch App AI generates on-the-fly lightweight applications based on your input that are tailored to the viewport of an Apple Watch.

## How does it work?

The simple Cloudflare Worker in the `.js` file here provides an Apple Watch friendly UI where a user can describe an application in free text. They hit `Build` and the text is sent to Cloudflare Workers AI along with a system prompt to give it some guardrails. Cloudflare Workers AI writes the HTML for the application (anything more complex became problematic to handle and then serve) and then displays it in a frame below the original form.

I had a prototype that would actually write a more complex Worker, deploy that Worker to Cloudflare Pages, and then return the link to be followed. However, parsing the responses proved too fickle.

## How can I use it?

Try it [here](https://ai-watch-apps.samrhea.workers.dev/)!
