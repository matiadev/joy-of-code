---
title: Syntax Highlight JavaScript Template Strings
description: Syntax highlight, and code completion inside JavaScript template strings.
slug: template-strings-syntax-highlight
published: '2021-9-7'
category: javascript
---

<script lang="ts">
	import Video from '#lib/components/video.svelte'
</script>

One of my favorite things when working with vanilla **JavaScript** is using [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) because it makes working with the **Document Object Model** (DOM) faster and more fun than using the **imperative** browser API.

Take the output of some movies as example.

```js:example.js showLineNumbers
const movies = ['Seven Samurai', 'Hara-Kiri', 'Yojimbo', 'The Sword of Doom']

const ulElement = document.createElement('ul')

for (const movie of movies) {
  const liElement = document.createElement('li')
  liElement.textContent = movie
  ulElement.append(liElement)
}

document.body.append(ulElement)
```

We didn't even add **classes**, **attributes**, or nested elements yet that make the code harder to read, and more error prone compared to using **template literals**. I'm **not** saying you **shouldn't** do it, but it sucks the fun out of it.

```js:example.js showLineNumbers
const movies = ['Seven Samurai', 'Hara-Kiri', 'Yojimbo', 'The Sword of Doom']

const moviesHtml = `
  <section>
    <h1>Samurai Movies</h1>
    <ul>
      ${movies.map((movie) => `<li>${movie}</li>`).join('')}
    </ul>
  </section>
`

document.body.innerHTML = moviesHtml
```

It's not perfect because we don't get the usual benefits and help from our code editor such as **syntax highlight**, **code completion** from [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense) and [Emmet](https://code.visualstudio.com/docs/editor/emmet) which causes similar problems I had before.

That's how I found [Inline HTML](https://marketplace.visualstudio.com/items?itemName=pushqrdx.inline-html), a **Visual Studio Code** extension that solves those problems.

To use it you only have to prefix the **template literal** with `html` or `/* html */`. You can do the same for **CSS** using `css` or `/* css */`.

```js:example.js showLineNumbers
const movies = ['Seven Samurai', 'Hara-Kiri', 'Yojimbo', 'The Sword of Doom']

const moviesHtml = /* html */ `
  <section>
    <h1>Samurai Movies</h1>
    <ul>
      ${movies.map((movie) => `<li>${movie}</li>`).join('')}
    </ul>
  </section>
`

document.body.innerHTML = moviesHtml
```

<Video src="extension.mp4" />

## Conclusion

That's it! 👏

Enjoy working on your next vanilla **JavaScript**, or **TypeScript** project. Use [Vite](https://vitejs.dev/) to further enhance your developer experience.

Thanks for reading! 🏄‍♀️
