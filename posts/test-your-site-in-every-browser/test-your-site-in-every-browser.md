---
title: Test Your Site In Every Browser
description: Learn how to test your site in Chrome, Firefox and Safari even on Linux and Windows.
slug: test-your-site-in-every-browser
published: '2022-5-20'
category: general
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="WWdZMLCuC4I" title="Test Your Site In Every Browser" />

## Table of Contents

## What Are The Major Browsers?

In this post you're going to learn how to check your site look great in every major browser including Chrome, Firefox and Safari regardless if you're using Linux, macOS or Windows.

If you look at the [browser market share worldwide](https://gs.statcounter.com/) Chrome is leading at **64%** while Safari has close to **20%** and Firefox **4%** of the market share (rest in peace Internet Explorer 💐).

Why are these the major browsers demanding our attention?

The reason is because these browsers have the highest market share but each has their own [browser engine](https://en.wikipedia.org/wiki/Browser_engine) (the browser engine is responsible for rendering the page on your screen) that makes it different enough resulting in having to test for it.

Most browsers such as [Brave](https://brave.com/) and [Microsoft Edge](https://www.microsoft.com/en-us/edge) among other browsers are [Chromium](<https://en.wikipedia.org/wiki/Chromium_(web_browser)>)-based, the same browser that [Google Chrome](https://en.wikipedia.org/wiki/Google_Chrome) uses meaning they are the same in that regard:

- Chrome uses [Blink](<https://en.wikipedia.org/wiki/Blink_(browser_engine)>) developed as part of the Chromium project as a fork of WebKit
- Firefox uses [Gecko](<https://en.wikipedia.org/wiki/Gecko_(software)>) developed by [Mozilla](https://en.wikipedia.org/wiki/Mozilla)
- Safari uses [WebKit](https://en.wikipedia.org/wiki/WebKit) developed by [Apple](https://en.wikipedia.org/wiki/Apple_Inc.)

This explains why we test for these browsers but the problem is that only Chrome and Firefox are available on all platforms but Safari is [macOS](https://en.wikipedia.org/wiki/MacOS) only, so you're out of luck if you're a Linux or Windows user. So what can you do?

## Method That Works For Linux, macOS, Windows

If you're a Linux user you're in luck because you can use a WebKit based browser such as [Epiphany](https://wiki.gnome.org/Apps/Web) and it works great without any setup, it's not going to match all the features of Safari but the browser engine they use is the same.

Windows on the other hand doesn't have any WebKit based browser you can use as far as I'm aware of, so you would have to use a virtual machine or use the latest [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/) that can use a graphical user interface and use Epiphany.

Instead of doing that you can use [Playwright](https://playwright.dev/) which is used for automated testing and has the ability to test every browser, this works because Playwright ships a binary for every browser including Chromium, Firefox and WebKit using their open source builds.

This is also useful to have a clean browser testing environment without extensions that can cause interference.

If you're not familiar with the JavaScript ecosystem you're going to need [Node.js](https://nodejs.org/en/) for the [npm](https://www.npmjs.com/) package manager.

> ⚠️ For Linux use Epiphany to test for Safari because Playwright only supports Ubuntu 20.04 LTS at the time of writing this, so you would have to use [Boxes](https://wiki.gnome.org/Apps/Boxes) on unsupported Linux distributions.

Here is how to set up Playwright.

1\. Initialize a new project inside an empty repository.

```shell:terminal
npm init -y
```

2\. Install `@playwright/test` as a development dependency.

```shell:terminal
npm i -D @playwright/test
```

3\. Install the default browsers.

```shell:terminal
npx playwright install
```

4\. Update `package.json`

The [Playwright CLI](https://playwright.dev/docs/test-cli) has some interesting options we can use like `--headed` and `--browser=webkit` to specify the browser so we can add these as **scripts** to `package.json`.

```json:package.json showLineNumbers
{
  "scripts": {
    "test:chrome": "npx playwright test --headed --browser=chromium",
    "test:firefox": "npx playwright test --headed --browser=firefox",
    "test:safari": "npx playwright test --headed --browser=webkit"
  },
  "devDependencies": {
    "@playwright/test": "^1.22.1"
  }
}
```

> 🐿️ The `npx` command avoids having to install a package globally by downloading and executing the binary.

5\. Add a test for Playwright

This is only so you can specify what page to visit and pause the browser so you can inspect the page, if you comment out the `page.goto` line it's going to open a blank tab.

```ts:tests/browser.test.ts showLineNumbers
import { test } from '@playwright/test'

test('test browser', async ({ page }) => {
  // point this to wherever you want
  await page.goto('http://localhost:3000/')

  // keep browser open
  await page.pause()
})
```

6\. Run the test using one of the scripts.

```shell:terminal
npm run test:safari
```

That's it! 🎉

Thanks to [@b1mind](https://twitter.com/b1mind) for testing this on Windows and confirming it works.

You don't have to have those awkward moments anymore hunting someone down with a Mac to test your site and your client is going to be happy.

The reason why WebKit doesn't work for Linux using this method unless you're using the latest LTS version of Ubuntu is because Playwright uses the Ubuntu package manager to install the dependencies - I couldn't figure out how to make it work on Arch based distros, or even the [latest Ubuntu LTS that's not supported yet](https://github.com/microsoft/playwright/issues/13738), so let me know if you figured it out!

```shell:terminal
npm run test:safari
```

```shell:terminal
  browserType.launch:

  Host system is missing dependencies to run browsers.
  Missing libraries:
    libpcre.so.3
    libicui18n.so.66
    libicuuc.so.66
    libwebp.so.6
    libenchant.so.1
    libffi.so.
```

Use this if you're using a supported version of Ubuntu.

```shell:terminal
npx playwright install-deps webkit
```

Regardless what method works for you now you can have confidence your site looks great in every browser regardless what operating system you're using.

Thanks for reading! 🏄️
