---
title: Console Logs Are Lying To You
description: Browser console logs are great but they can be deceiving and waste your time unless you understand how they work.
slug: console-logs-are-lying-to-you
published: '2026-3-4'
category: javascript
---

<script lang="ts">
	import YouTube from '$lib/components/youtube.svelte'
</script>

<YouTube id="wpaioC9RtOA" title="Console Log Are Lying To You" />

## Table of Contents

## Why You Can't Trust Console Logs

You've probably been burned by this before without even realizing it. You add a `console.log` to inspect a value, open the developer tools, **unfold** the log containing an object or array — and the data looks wrong.

It seems like changes that happen **later** in the code are already reflected in your log:

```ts:example
let obj = { x: 1 }
console.log(obj) // you expect { x: 1 }

// some time later
obj.x = 2

// you unfold the log in developer tools
// { x: 2 } ??
```

If you expand the log in developer tools, you'll see `{ x: 2 }` instead of `{ x: 1 }`. The `console.log` ran when `x` was `1`, but by the time you unfold it, `x` has already been updated to `2`.

In this example it's obvious, but when you're dealing with a deeply nested object or a large array being transformed through several operations, you probably wouldn't notice it and be confused as a result.

## Why Console Logs Lie

When you log an object or array, you're **not** logging a snapshot of its value at that moment. You're logging a **reference** to it in memory.

When you later unfold that log entry in developer tools, the browser evaluates the reference **at that point in time** and not when `console.log` was called.

The warning was in front of us this entire time! If you hover over the blue information icon to the right of the log, it reads:

> This value was evaluated upon first expanding. It may have changed since then.

I've looked up the reason and turns out, `console.log` is lazy-evaluated intentionally for performance — there's no point evaluating the full structure of every logged value until you actually open it.

It also only reevaluates once, so further changes to the value have no impact:

```ts:example
let obj = { x: 1 }
console.log(obj) // expands to { x: 2 }

// the updated value
obj.x = 2
// doesn't reevaluate again
obj.x = 3
```

## How To Take A Real Snapshot

There are a few ways to log the actual value at the time of the log call, rather than a live reference.

### Spreading The Value

```ts:example
console.log([...items].map((item) => ({ ...item })))
```

Spreading `items` alone creates a **shallow copy** — the top-level array is new, but its objects still point to the same references in memory. You need to spread each item too, which is why the `.map` is necessary here.

Note that this only works one level deep — for deeply nested structures, prefer `structuredClone` instead.

### Cloning The Value

```ts:example showLineNumbers
console.log(structuredClone(items))
```

`structuredClone` is a built-in JavaScript method that creates a **deep clone** of a value. This is the cleanest option for nested structures, and it requires no dependencies.

### Stringifying The Value

```ts:example
console.log(JSON.parse(JSON.stringify(items)))
```

This is a classic trick that serializes the value to a JSON string and immediately parses it back into a new object. It produces a deep copy and works everywhere, though it can't handle values that aren't JSON-serializable (like `undefined`, functions, or circular references).

All three of these approaches give you a true snapshot of the data at the moment `console.log` runs, so the value won't change when you unfold it in developer tools.

## Use The Debugger

Instead of reaching for `console.log`, you can add a `debugger` statement:

```ts:example
let obj = { x: 1 }
debugger
// ...
```

This way the browser's built-in debugger pauses execution and gives you insight into your entire application state at that exact moment.

You can inspect every variable in scope, step through your code line by line, and see exactly what's happening — without any of the reference-evaluation and timing issues that `console.log` has.

## Conclusion

I love `console.log`, but it's also important to remember that objects and arrays are logged by reference, not by value. When you unfold them in developer tools, you're seeing the current state of that reference — which may have changed since the log was called.

To work around this, use `structuredClone`, a spread with a deep copy, or `JSON.parse(JSON.stringify(...))` to take a true snapshot.

Or better yet, drop a `debugger` statement and let the browser's built-in debugger do the heavy lifting.
