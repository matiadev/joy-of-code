---
title: Reduce Next.js Bundle Size by Half
description: Learn how using Preact instead of React can reduce Next.js bundle size by half.
slug: next-bundle-size
published: '2021-9-1'
category: next
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
</script>

[Next.js](https://nextjs.org/) is a **meta-framework** built on top of [React](https://reactjs.org/) that solves the problem of **hybrid static and server rendering** for **React**.

That being said the [react](https://bundlephobia.com/package/react@17.0.2) package itself is a tiny library, but combined with [react-dom](https://bundlephobia.com/package/react-dom@17.0.2) it's **42 kB** of **runtime** we ship to the client.

<Image src="react.webp" alt="Next.js bundle size using React" />

The final **Next.js** bundle size is **79.46 kB**.

[Preact](https://preactjs.com/) is a **React** alternative with the same API, but it's only [3kb in size](https://bundlephobia.com/package/preact@10.5.14). This is possible because it doesn't have extra overhead from using [synthetic events](https://reactjs.org/docs/events.html) like **React**, but uses the **browser's native API**.

If you want to be more informed about the differences, **Preact** has an entire page dedicated explaining the [differences to React](https://preactjs.com/guide/v8/differences-to-react/) (you could say it's _svelte_ 🥁).

This might sound like a lot of work, but it only requires two steps changing the **Webpack** config inside **Next.js**. Credits go to [Lee Robinson](https://leerob.io/).

The first step is to install **Preact**.

```shell:terminal
npm i preact
```

The second step is replacing **React** with **Preact** in production by changing the `next.config.js`.

```js:next.config.js showLineNumbers
module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }
    return config
  },
}
```

That's it! 🥳 Next time you run `npm run build`, and `npm start` there's a **48%** reduction in bundle size at **45.28 Kb**.

<Image src="preact.webp" alt="Next.js bundle size using Preact" />

## Conclusion

This is a great method to save your users from having to download the entire **React** runtime, but make sure you're informed about the differences between **React** and **Preact** if you need some specific **React** features.

Thanks for reading! 🏄‍♀️
