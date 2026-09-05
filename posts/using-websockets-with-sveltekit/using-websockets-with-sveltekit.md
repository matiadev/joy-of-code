---
title: Using WebSockets With SvelteKit
description: Learn how to use a custom SvelteKit server for WebSockets.
slug: using-websockets-with-sveltekit
published: '2022-5-1'
category: sveltekit
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="mAcKzdW5fR8" title="Using WebSockets With SvelteKit" />

## Table of Contents

## Using WebSockets

If you're reading this in the future SvelteKit might have native support for WebSockets similar to how it does HTTP request methods so it might be worth checking the documentation.

```ts:+server.ts showLineNumbers
// HTTP request methods
export function GET() {}
export function POST() {}

// Doesn't exist yet! 😅
export function WS() {}
```

You can read [the discussion about native support for WebSockets inside SvelteKit](https://github.com/sveltejs/kit/issues/1491) if you want.

One solution is to create a separate server but then you have to run two things on separate ports so let me show you how you can do it using SvelteKit instead.

## WebSockets For Development

To be able to use WebSockets during development you need to write a simple plugin for [Vite](https://vitejs.dev/) using the [configureServer](https://vitejs.dev/guide/api-plugin.html#configureserver) method to hook into the development server.

Credit goes to [Bob Fanger](https://github.com/bfanger) for the [solution](https://github.com/sveltejs/kit/issues/1491#issuecomment-955205323).

Install the [Node adapter](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) with `npm i -D @sveltejs/adapter-node` because it's required for this to work.

```js:vite.config.ts {2,4,6-17,20} showLineNumbers
import { sveltekit } from '@sveltejs/kit/vite'
import { type ViteDevServer, defineConfig } from 'vite'

import { Server } from 'socket.io'

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return

		const io = new Server(server.httpServer)

		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hello, World 👋')
		})
	}
}

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
})
```

> 🐿️ Use a dynamic import if you need to import code that's not a module inside `webSocketServer` for example `const code = await import('./code.js')` otherwise you're going to encounter an error.

Here's an example how this works using `Socket.io` on the client.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { io } from 'socket.io-client'

  const socket = io()

  socket.on('eventFromServer', (message) => {
    console.log(message)
  })
</script>
```

If you start the development server with `npm run dev` it should work and you should see the `Hello, World 👋` message in the console.

If you want to emit a message when a value changes don't forget you can use a reactive declaration block.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  // ...

  $: {
    // send message to server
    socket.emit('eventFromClient', $reactiveValue)
  }
</script>
```

## WebSockets For Production

Thanks to the Sveltekit [Node adapter](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) you can create a [custom server](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) and do whatever you want.

I'm going to use [Express](https://expressjs.com/) because it's a minimal web framework.

```shell:terminal
npm i express @types/express
```

The Node adapter creates the `index.js` and `handler.js` files in your `build` folder when you run `npm run build`.

To use a custom server you have to import the `handler` from `build/handler.js` and use the custom server instead of `index.js`.

Create the `build` folder.

```shell:terminal
npm run build
```

I have created the `server/index.js` file at the root of the project for convenience but this depends on your build step and where you're deploying it.

```js:server/index.js showLineNumbers
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { handler } from '../build/handler.js'

const port = 3000
const app = express()
const server = createServer(app)

const io = new Server(server)

io.on('connection', (socket) => {
  socket.emit('eventFromServer', 'Hello, World 👋')
})

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
app.use(handler)

server.listen(port)
```

Add the script to start the server inside `package.json`.

```json:package.json showLineNumbers
{
  "scripts": {
    "start": "node ./server"
    // ...
  }
}
```

You can run `npm start` and open [http://localhost:3000/](http://localhost:3000/) to check if everything works.

That's it! 🥳
