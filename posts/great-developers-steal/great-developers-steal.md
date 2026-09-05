---
title: Great Developers Steal
description: What is open source education? Find out how it can help you learn and improve faster.
slug: great-developers-steal
published: '2021-3-7'
category: javascript
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
</script>

## Table of Contents

## Good Developers Copy, Great Developer Steal

We often reach for a library to solve a problem for us. You can write everything from scratch, and there's pride and feeling of ownership in doing so, but it's not realistic time-wise. We should strive to at least understand what we're including in our code. Often we don't need the entire library, but just a piece of functionality.

The title is a play on words from the famous Pablo Picasso quote: "Good artists copy, great artist steal". It's not talking about stealing as in theft, but taking ideas, and inspiration from others making them your own. Without understanding we start to rely on our tools to do the thinking for us. The best cure to [impostor syndrome](https://en.wikipedia.org/wiki/Impostor_syndrome) is experience which is gained by doing. Don't follow a path set by others. It's going to ring hollow.

## Third-Party Code

Third-party code is anything you yeet from [StackOverflow](https://stackoverflow.com/), or a library you include. It's code you didn't write yourself. What's the difference between copying a random piece of code from StackOverflow, and including a package from [npm](http://npmjs.com/)? If we think about it, not a lot. In the case of the package, we often don't even look at the source code. We blindly trust the code not to format our system, and work as advertised.

There's a lot of packages on npm, over a million. That's a lot. Take a package like [is-odd](https://www.npmjs.com/package/is-odd) with over half a million monthly downloads that does what the name implies, checks if a number is odd. It doesn't take a genius to realize we probably don't need a dependency for a single line of code that's `(n % 2) === 1`. It even includes another dependency [is-number](https://www.npmjs.com/package/is-number) with ~45 million weekly downloads! Let me make one thing clear. I'm not trying to shame, or make fun of anyone. I'm just trying to point out how many of us reach for these things. Your favorite libraries, and frameworks include some of these as dependencies.

**What I'm trying to say is that before we include a library, we should consider if we need the entire library.**

In a recent project I had to convert a number to a fraction, and vice versa. I only had one problem. I'm not great at math. Turning a fraction to a decimal was simple enough, but doing the opposite not so. I was looking over at StackOverflow threads, and being reminded of my years in school while I was resting my eyes in math class.

First I found [mathjs](https://mathjs.org/) and thought "sweet" to myself. It can easily do everything I want. I used [BundlePhobia](https://bundlephobia.com/result?p=mathjs@9.2.0) to check the size, and to my surprise it was almost 160kb, if that doesn't mean anything to you, that's larger than the framework (React) I'm using. 😱

Of course, you wouldn't ship the entire thing to the browser. It hopefully uses [tree shaking](https://en.wikipedia.org/wiki/Tree_shaking) which should eliminate code that's not being used leading to a smaller bundle size.

## Open Source Education

The fastest way to learn is looking through other people's source code. Don't wait for someone to show you how to do something. You can learn yourself by looking at any public repository on GitHub. This is what I mean by open source education.

I found [number2fraction](https://www.npmjs.com/package/number2fraction). I decided to look into how it works. I could have done the same with mathjs, but it was using [fraction.js](https://www.npmjs.com/package/fraction.js) as another dependency. The package is tiny in comparison, but the same holds true.

We can search for the name of the method used in the API to find where it's located. In this case it's `number2fraction()`. If you can't find what you're looking for, clone the repo to your machine. You can also try importing it to [CodeSandbox](https://codesandbox.io/). This is why I'm excited about [GitHub Codespaces](https://github.com/features/codespaces).

Anyhow, the search lead me to a [couple of results](https://github.com/rimara14/number2fraction/search?l=TypeScript&q=number2fraction). I could quickly identify the one I'm looking for being [number-to-fraction.ts](https://github.com/rimara14/number2fraction/blob/master/src/number-to-fraction.ts).

<Image src="search-results.webp" alt="GitHub search results for number2fraction" />

Files including `.spec` (short for specification) are also helpful. They're test files to ensure the code works as intended. It's useful to us, because we can see how it's used if we have to (the reason being incomplete, or hard to understand documentation).

<Image src="spec.webp" alt="Number to fraction test" />

Don't be intimidated at looking at TypeScript files. TypeScript is JavaScript. You can ignore type annotations. You can always copy the piece of code, and remove TypeScript to not distract you. In a lot of situations, the code should also have some helpful comments.

```ts:number-to-fraction.ts showLineNumbers
const decimalPattern = /^\d+\.\d+$/

/**
 * convert decimal number to fraction
 */
export function number2fraction(n: number): string {
  if (!decimalPattern.test(n.toString())) {
    return n.toString()
  }

  const strNum = n.toString()
  const afterDecimal = strNum.length - 2
  const denominator = Math.pow(10, afterDecimal)
  const numerator = n * denominator
  const divisor = gcd(numerator, denominator)
  return `${numerator / divisor}/${denominator / divisor}`
}

/**
 * find greatest common divider between x & y
 */
function gcd(x: number, y: number): number {
  if (!y) {
    return x
  }

  return gcd(y, x % y)
}
```

I prefer cleaning things up, including variable names. It makes understanding what's going on a lot simpler. There's barely any TypeScript, but I'm going to remove it for demonstration purposes.

There's not much to it. After cleaning it up I go over each line. If you don't understand how something works, you don't need the person who wrote the code to explain it to you. Make a note of it, and open [Discord](https://discord.com/) to get help. Make sure you frame the question, so it's coherent.

```js:number-to-fraction.js showLineNumbers
/*
regex pattern that checks if the number is a decimal,
paste it into https://regexr.com/ to learn how it works.
*/
const isDecimal = /^\d+\.\d+$/

export function number2fraction(number) {

  /*
  checks if passed in value is a decimal,
  you can learn more about https://mdn.io/test.
  */
  if (!isDecimal.test(number.toString())) {

   /*
   if not, return string representation because the
   function expects the return to be a string.
   */
    return number.toString()
  }

  // store stringified number, for example '1.5'
  const stringifiedNumber = number.toString()

  /*
  return amount of numbers after the decimal point where the
  subtracted amount represents the number, and period so
  it works for '1.5', but would break for '10.5'.

  not sure why they didn't use a more reliable method such as
  '10.5'.split('.')[1].length.
  */
  const afterDecimal = stringifiedNumber.length - 2

  /*
  the denominator is the number below the fractional bar.
  this is just returning the base based on after decimal amount,
  for example '1.5' equals 10, or '1.50' equals 100.
  */
  const denominator = Math.pow(10, afterDecimal)

  /*
  the numerator is the number above the fractional bar,
  for example 1.5 * 10 equals 15.
  */
  const numerator = number * denominator

  /*
  if we read about
  https://en.wikipedia.org/wiki/Greatest_common_divisor
  we can see it can be used to reduce a fraction.
  */
  const divisor = greatestCommonDivisor(numerator, denominator)

  /*
  we had a fraction of 15/10 and calculcated the divisor to be 5.
  now we only have to return the fraction 15/5 equals 3,
  10/5 equals 2, meaning 1.5 is equal to 3/2.

  if we want to simplify this further to 1 1/2 we can learn how by
  using https://www.calculatorsoup.com/ which is a great way to
  learn how it works step by step.
  */
  return `${numerator / divisor}/${denominator / divisor}`
}


/*
this is a recursive function that invokes itself until
there's no remainder left after doing x % y.

we can learn how it works by writing the steps on paper
instead of doing mental gymnastics.
*/
function greatestCommonDivisor(x, y) {
  if (!y) {
    // y is falsy, so return x
    return x
  }

  /*
  x = 15, y = 10
  x = 10, y = 5 (15 % 10)
  x = 5, y = 0 (10 % 5)
  */
  return greatestCommonDivisor(y, x % y)
}
```

## Vendor

Sometimes a package you include works, but lacks a feature you'd want. You can contribute to the project, but "the deadline was yesterday". There could be a lot of other reasons why you'd want to do this. Maybe you have security concerns. You don't want to be a victim of [cryptojacking](https://www.forcepoint.com/cyber-edu/cryptojacking). Either way, in your project structure you can create a `vendor` folder to store your third-party code. Package managers are just glorified file downloaders, and dependency resolvers. The only downside is that you're also the maintainer.

## Conclusion

Looking at things through the lens of code can crystalize things for us. We don't need to have a deep understanding of everything. If we gain enough knowledge, and insight to gain confidence that things aren't as scary as we believe it's only a benefit to us.

Don't use not being good at something as an excuse. Given enough time, you can learn how most things work. Learning how to learn is analogous to "Give a man a fish, and you feed him for a day. Teach a man To fish, and you feed him for a lifetime". Questions are your fishing rod. Enjoy fishing. 🎣
