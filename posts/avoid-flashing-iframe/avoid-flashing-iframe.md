---
title: How Code Sandboxes Update Content
description: How do code sandboxes update the iframe without causing flashing?
slug: avoid-flashing-iframe
published: '2021-9-29'
category: javascript
---

<script lang="ts">
	import Video from '#lib/components/video.svelte'
</script>

In a [previous post](https://joyofcode.xyz/create-a-coding-sandbox) we created a simple **code sandbox** from scratch using plain **TypeScript** and it works great but then I noticed something interesting.

Whenever you update code on sites such as [Codepen](https://codepen.io/) the **iframe flashes** because it tears down and rebuilds the **DOM** (Document Object Model). When I was using the [Svelte REPL](https://svelte.dev/repl/hello-world), or [CodeSandbox](https://codesandbox.io/) I noticed it doesn't do that — in fact it updates **instantly** without the **iframe flashing**.

At first I wondered how could this be — does it use some clever **DOM** updates behind the scenes? The answer is simpler than you might think.

## The Flashing Iframe

First let me show you the offending code.

```html:index.html showLineNumbers
<textarea spellcheck="false"></textarea>
<iframe></iframe>
```

```js:app.js showLineNumbers
const editorElement = document.querySelector('textarea')
const iframeElement = document.querySelector('iframe')

editorElement.addEventListener('input', (event) => {
  // get current editor value
  const html = event.target.value

  // update iframe
  iframeElement.srcdoc = `
    <html>
      <body>
        ${html}
      </body>
    </html>
  `
})
```

<Video src="iframe-flashing.mp4" />

The code just takes a `<textarea>` input and updates the `srcdoc` attribute of the `<iframe>` creating a minimal code sandbox.

In my example I have some basic styles that I haven't included here to keep things simple.

## The Solution

The **solution** to the flashing iframe is to not update the `srcdoc` each time a change happens but send a **message** from the parent to perform **DOM** manipulations inside the `<iframe>` which causes no refresh.

We can do this using the [window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) method from the parent `window` and listen for **messages** inside the `<iframe>` using the [message event listener](https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event).

```js:app.js showLineNumbers
const editorElement = document.querySelector('textarea')
const iframeElement = document.querySelector('iframe')

iframeElement.srcdoc = `
  <html>
    <head>
    <script type="module">
      window.addEventListener('message', (event) => {
        const { type, value } = event.data;

        if (type === 'html') {
          document.body.innerHTML = value;
        }
      })
    </script>
    </head>
    <body>
    </body>
  </html>
`

editorElement.addEventListener('input', (event) => {
  // get current editor value
  const value = event.target.value

  // imagine you had different file types
  const html = { type: 'html', value }

  iframeElement.contentWindow.postMessage(html, '*')
})
```

<Video src="iframe-without-flashing.mp4" />

You can determine what to do based on the `type`. For example you can inject **CSS**, or insert a `<script>` tag to execute **JavaScript** code.

The second parameter of `postMessage` is the **target origin**. In this case we're saying **\*** which means **anything**.

## Conclusion

This might seem insignificant but it provides a magical user experience. Stay curious and question how things work.

Thanks for reading! 🏄‍♀️
