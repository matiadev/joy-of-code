---
title: Static Pages Without JavaScript Using Next.js
description: Remove client-side JavaScript in Next.js for production on a per-page basis.
slug: static-pages-without-javascript
published: '2021-9-4'
category: next
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
</script>

[Next.js](https://nextjs.org/) isn't a pure **HTML static site generator** since **JavaScript** is required for many interactive parts of the site.

Most people that visit your site stay there for one **page**, so we don't have to incur a cost of the entire **JavaScript** runtime.

That said, if you have a **page** that doesn't require **JavaScript** wouldn't it be great if you could just **remove** it? You can do that thanks to a [experimental Next.js feature](https://github.com/vercel/next.js/pull/11949).

<Image src="experimental-feature.webp" alt="Experimental feature for removing client-side JavaScript in production" />

I created a typical **Next.js** app using `npx create-next-app --typescript` and removed some of the cruft, so we're left with basic styles.

<Image src="network-with-javascript.webp" alt="Network tab JavaScript bundle size" />

I ran `npm run build`, and after `npm start` we're greeted with a bundle size of **71.89 kB**. If we look inside the **Inspector** we can see the **JavaScript** used to run this single **page**.

<Image src="inspector-with-javascript.webp" alt="Inspector tab with JavaScript" />

There's no **JavaScript** required on this page, so let's remove it. This requires us to export a `config` inside a **page** with the experimental `unstable_runtimeJS` option set to `false`.

```js:index.tsx showLineNumbers
export const config = {
  unstable_runtimeJS: false
}
```

After we **build** and open the **page** we can see the size is just **3 kB** since there's no **JavaScript**, and inside the **Inspector** there's only **static HTML**.

<Image src="network-without-javascript.webp" alt="Network tab without JavaScript" />

<Image src="inspector-without-javascript.webp" alt="Inspector tab without JavaScript" />

If you have other **pages** everything works fine. It's just going to download **JavaScript** when it's **required** which means we don't get **preloading**.

## Conclusion

Keep in mind this is **experimental** and **only works in production**, so if you're in **development** everything might seem to work but remember the **JavaScript** won't work in **production**.

You can't execute **JavaScript** on the page without injecting custom `<script>` tags into the rendered **HTML** as mentioned in the pull request, but for most **static pages** it works great.

If you're interested in reducing the bundle size of your **Next.js** site for parts where you do use **JavaScript**, I wrote [Reduce Next.js Bundle Size by Half](https://joyofcode.xyz/next-bundle-size).

Thanks for reading! 🏄‍♀️
