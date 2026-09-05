---
title: How To Screenshot The Entire Page
description: You don't need extensions to screenshot the page, sections and elements.
slug: screenshot-page-and-dom-elements
published: '2021-10-4'
category: general
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
</script>

## Firefox

One of the [Firefox](https://www.mozilla.org/en-US/firefox/new/) features I love is the [Take a Screenshot](https://support.mozilla.org/en-US/kb/take-screenshots-firefox) tool that let's you capture **visible parts** of the page, the **full page**, or **DOM** (Document Object Model) elements.

You can do so using the **dropdown option**, or the <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> **shortcut**.

<Image src="firefox-screenshot.webp" alt="Taking screenshot of elements in Firefox" />

## Chrome

This is the one thing I miss when using [Brave](https://brave.com/) but there's a solution that works for any [Chromium](<https://en.wikipedia.org/wiki/Chromium_(web_browser)>) based browser.

Open your developer tools with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>, or use the **options menu** from your browser.

Inspired by the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) from [Visual Studio Code](https://code.visualstudio.com/) you can open the [Command Menu](https://developer.chrome.com/docs/devtools/command-menu/) with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> and typing **screenshot** you get these options.

<Image src="brave-screenshot.webp" alt="Taking screenshot of elements in Brave" />

If you want to capture a **DOM** element it has to be **selected** in **elements**.

## Conclusion

While it's not as convenient as **Firefox** at least you don't require an extension but if you're looking for one that lets you also record video you can use something like [Nimbus](https://chrome.google.com/webstore/detail/nimbus-screenshot-screen/bpconcjcammlapcogcnnelfmaeghhagj?hl=en).

Thanks for reading! 🏄‍♀️
