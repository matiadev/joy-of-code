---
title: Introduction To 3D With Svelte
description: Introduction to using 3D in the browser with Svelte and Threlte.
slug: introduction-to-3d-with-svelte
published: '2022-10-31'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import Image from '#lib/components/image.svelte'
	import Video from '#lib/components/video.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="89LYeHOncVk" title="Introduction to 3D With Svelte" />

## Table of Contents

## Introduction

By the end of this post you're going to learn how to spice up your boring site using 3D with Svelte in the browser.

> ⚠️ The video is **outdated** but the post has been updated to the newest **Threlte 6** version.

<Embed src="https://stackblitz.com/github/joysofcode/svelte-3d?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Svelte 3D" title="Svelte 3D" />

> 🧪 The project files are available on [GitHub](https://github.com/joysofcode/svelte-3d) and you can try it on [StackBlitz](https://stackblitz.com/github/joysofcode/svelte-3d).

## What Is Threlte?

Three.js is a 3D framework for JavaScript that abstracts having to write low-level graphics code yourself and lets you create anything from [immersive 3D experiences](https://www.awwwards.com/sites/kamabokonoheya) to [games](https://bruno-simon.com/) in your browser.

> 🐿️ You might have heard of [Svelte Cubed](https://svelte-cubed.vercel.app/), or [Svelthree](https://svelthree.dev/) but Threlte [seems to be the winner](https://twitter.com/Rich_Harris/status/1599090054382596097).

[Threlte](https://threlte.xyz/) is a 3D framework for Svelte for using [Three.js](https://threejs.org/) in a more declarative way.

What does **declarative** even mean?

Using **imperative** code you have to specify each step to get to a desired outcome.

```js:example.js showLineNumbers
const titleEl = document.createElement('h1')
titleEl.innerText = 'Hello'
document.body.append(titleEl)
```

Using **declarative** code you just state the desired outcome.

```svelte:+page.svelte showLineNumbers
<h1>Hello</h1>
```

## Creating Your First 3D Scene

If you want to learn more about Three.js and 3D in general read [Three.js fundamentals](https://threejs.org/manual/#en/fundamentals) and you can use the [Three.js editor](https://threejs.org/editor/) to play around.

The way you learn Three.js is from the [Three.js documentation](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) and you're going to see how intuitive it's to translate a Three.js example to Threlte.

The easiest way to get started with Threlte is using their CLI.

```shell:terminal
npm create threlte
```

```shell:terminal
┌  Welcome to Threlte!
│
◇  Where should we create your project?
│   (hit Enter to use current directory)
│
◇  Add type checking with TypeScript?
│  Yes, using TypeScript syntax
│
◇  Select additional options (use arrow
keys/space bar)
│  none
│
◇  Select Threlte packages (use arrow
keys/space bar)
│  @threlte/extras
│
◇  Initialize a git repository?
│  No
│
◇  Install dependencies using pnpm?
│  No
│
└  Your project is ready!
```

The only additional package I'm going to use is `@threlte/extras` for some Threlte utils.

If you haven't, install the dependencies with `npm i` and start the development server with `npm run dev`.

You can play around with the default example but I'm going to delete the `lib` folder and start from nothing.

Inside `routes` create a `+layout.svelte` file.

```svelte:src/roues/+layout.svelte showLineNumbers
<div class="scene">
	<slot />
</div>

<svelte:head>
	<title>Threlte</title>
</svelte:head>

<style>
	.scene {
		position: absolute;
		inset: 0;
		background: radial-gradient(hsl(220 14% 20%), hsl(220 20% 10%));
	}
</style>
```

Using a wrapper element `.scene` is important because the dimensions of `<canvas>` are based on the parent.

Inside `+page.svelte` I'm going to set up the scene.

```svelte:src/routes/+page.svelte
<script lang="ts">
	import { Canvas } from '@threlte/core'
	import Scene from './scene.svelte'
</script>

<Canvas>
	<Scene />
</Canvas>
```

Create a `scene.svelte` component where the magic is going to happen and add a camera, lights and a mesh to your scene.

```svelte:src/routes/scene.svelte
<script lang="ts">
	import { T } from '@threlte/core'
	import { Grid, OrbitControls, TransformControls } from '@threlte/extras'
	import * as Three from 'three'
	import { DEG2RAD } from 'three/src/math/MathUtils'
</script>

<!-- Grid -->
<Grid cellColor="#808080" sectionSize={0} />

<!-- Camera -->
<T.PerspectiveCamera position={[20, 20, 20]} fov={50} makeDefault>
	<!-- Controls -->
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<!-- Lights the scene equally -->
<T.AmbientLight color="#ffffff" intensity={0.2} />

<!-- Light that casts a shadow -->
<T.DirectionalLight
	color="#ffffff"
	intensity={2}
	position={[10, 10, 0]}
	shadow.camera.top={8}
	castShadow
/>

<!-- Sphere -->
<T.Mesh position={[0, 4, 0]} let:ref castShadow>
	<T.SphereGeometry args={[4, 64, 64]} />
	<T.MeshStandardMaterial color="#ffffff" />
	<TransformControls object={ref} />
</T.Mesh>

<!-- Floor -->
<T.Mesh rotation.x={DEG2RAD * 90} receiveShadow>
	<T.PlaneGeometry args={[20, 20]} />
	<T.MeshStandardMaterial color="#ffffff" side={Three.DoubleSide} />
</T.Mesh>
```

<Image src="sphere.webp" alt="First 3D scene in Threlte showing a sphere" />

- `<T>` is where everything comes from and it extends the [base Three.js class](https://threejs.org/docs/#api/en/core/Object3D)
- I'm using a `<PerspectiveCamera>` that's slightly above the mesh with a set field of view
- The `<AmbientLight>` is going to equally light your scene, think of it as cheap global illumination
- The `<DirectionalLight>` is more like a sun in your scene that also casts a shadow
- The sphere and floor use `<T.Mesh>` where you can set the geometry and material for the mesh
- The floor uses `DoubleSide` from Three.js, so it's visible from both sides and uses the `DEG2RAD` helper to rotate it by 90 degrees because it uses [radians](https://www.mathsisfun.com/geometry/radians.html)

There's a bunch of helpers from `@threlte/extras`. You can render a grid with the `<Grid>` component and use `<OrbitControls>` to use your mouse to orbit around your scene. If you want to move an object in the scene you can attach `<TransformControls />` to meshes and lights.

Threlte has an intuitive API.

```svelte:example.svelte showLineNumbers
<script>
  import { T } from '@threlte/core'
</script>

<T.Mesh position.y={1}>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshBasicMaterial color="aqua" />
</T.Mesh>
```

The same example using Three.js.

```ts:example.ts showLineNumbers
const mesh = new THREE.Mesh()
const geometry = new THREE.BoxGeometry(1, 2, 1)
const material = new THREE.MeshBasicMaterial()
mesh.position.y = 1
material.color.set('aqua')
```

Translating a Three.js example to Threlte is intuitive.

You can pass the constructor arguments via `args` and if you want to know other options look at [Object3D](https://threejs.org/docs/#api/en/core/Object3D) from the Three.js docs which is the base class for most objects and has things like `position`, `rotation`, and `scale`.

Threlte uses **pierced props** which you have already seen used to pass `position.y` for a mesh, and `shadow.camera.top` for the camera to increase how far the shadow is cast.

You only have to look at a Three.js example and you can intuitively translate it to Threlte.

## Importing 3D Models

You can get free 3D models from [Sketchfab](https://sketchfab.com/), and make sure you check "downloadable" to filter the results.

There's a lot of options for 3D file formats but you want [GLB](https://www.wikiwand.com/en/GlTF) (GL Transmission Format Binary file) that's more efficient for sharing 3D data on the web (**GLTF** is also fine but **GLB** keeps everything in one binary file).

Threlte makes it easy to import a 3D model using the `useGltf` hook, and you can even control animations with the [`useGltfAnimations`](https://threlte.xyz/docs/reference/extras/use-gltf-animations) hook.

```svelte:src/routes/scene.svelte showLineNumbers
<script lang="ts">
	import { T, useFrame } from '@threlte/core'
	import { OrbitControls, useGltf } from '@threlte/extras'
	import Bloom from './bloom.svelte'

	let y = 2
	let rotation = 0

  // Spooky floating ghost 👻
	function levitate() {
		const time = Date.now() / 1000
		const speed = 1
		const offset = 3
		y = Math.sin(time * speed) + offset
		requestAnimationFrame(levitate)
	}

  // Rotates model on `Y` axis
	useFrame((_, delta) => {
		rotation += delta * 0.4
	})

	levitate()
</script>

<!-- Bloom postprocessing effect -->
<Bloom />

<!-- Orthographic camera -->
<T.OrthographicCamera position={[10, 10, 10]} zoom={40} makeDefault>
	<!-- Controls -->
	<OrbitControls enableDamping />
</T.OrthographicCamera>

<!-- Ambient light for ambience -->
<T.AmbientLight color="#0000ff" intensity={10} />

<!-- Main light -->
<T.PointLight intensity={2} position={[4, 2, 4]} color="#76aac8" />

<!-- Ghost -->
{#await useGltf('/assets/ghost.glb') then ghost}
	<T is={ghost.scene} position={[0, y, 0]} scale={0.4} />
{/await}

<!-- Garden -->
{#await useGltf('/assets/garden.glb') then garden}
	<T is={garden.scene} rotation.y={rotation} />
{/await}
```

<Video src="models.mp4" />

You can look at the `<Bloom />` postprocessing effect in the example, but I mostly copied it from the Threlte [docs](https://threlte.xyz/docs/reference/core/use-render#post-processing).

That's it! 🥳
