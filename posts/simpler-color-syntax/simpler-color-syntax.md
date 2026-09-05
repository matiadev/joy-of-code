---
title: Use The Simpler CSS Color Syntax
description: Learn how to write simpler CSS color syntax thanks to CSS Color Module Level 4.
slug: simpler-color-syntax
published: '2021-4-11'
category: css
---

## Table of Contents

## CSS Features Are Split Into Modules, and Levels

The CSS specification is a living standard. Instead of shipping large releases that takes years for features to hit browsers, we get them when they're ready.

Features of CSS are split into modules, and levels such as [CSS Flexbox](https://www.w3.org/TR/css-flexbox-1/), or [CSS Grid](https://www.w3.org/TR/css-grid-1/).

The [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) specification adds:

- Commaless syntaxes for the `rgb()`, `rgba()`, `hsl()`, and `hsla()` functions
- Allows alpha values in `rgb()` and `hsl()`, turning `rgba()` and `hsla()` into (deprecated) aliases for them
- Adds 4, and 8 digits hex color values, where the last digit(s) represents the alpha value

A lot of these features aren't new, but they're not used frequently either.

## Hex

Hex codes are probably what you're used to.

```css:example.css showLineNumbers
/* hex code */
.element {
  color: #004488;
}

/* hex shorthand */
.element {
  color: #048;
}
```

How the shorthand works is that you abbreviate each color channel using one character to represent red, green, and blue values.

For example `#004488` can be read as `00 44 88`, so the shorthand would be `#048`.

**Did you know you can add opacity to a hex color?**

Doing so changes the hex code format from #RRGGBB to #RRGGBBAA (8 digits), or #RGBA (4 digits) for the shorthand.

```css:example.css showLineNumbers
.element {
  /* rgba */
  color: rgba(0, 128, 128, 50%);

  /* hexa (hex + alpha) */
  color: #00888888;

  /* hexa shorthand */
  color: #0888;
}
```

**Keep in mind the opacity value is represented in hexadecimal.**

## RGB

If you're using `rgb()`, you can write it like this instead since the former syntax is going to be deprecated.

```css:example.css showLineNumbers
/* rgb */
.element {
  color: rgb(0 128 128);
}

/* rgba */
.element {
  color: rgba(0 128 128 / 50%);
}
```

## HSL

I have a strong preference for `hsl()` which I plan to cover in another post.

For one it makes it easier to create, and reason about your design system than other values since:

- **Hue** is just a degree on the color wheel from **0 to 360** (0° = red, 120° = green, 240° = blue)
- **Saturation** is a percentage where **0% is gray**, and **100% is the full color**
- **Lightness** is a percentage where **0% is black**, **50% is normal**, and **100% is white**

```scss:example.css showLineNumbers
/* hsl */
.element {
  color: hsl(180 100% 25%);
}

/* hsla */
.element {
  color: hsla(180 100% 25% / 50%);
}
```

You can also use decimal values instead of percentages for the opacity, but I prefer to be explicit.

## Conclusion

Thanks for reading. ❤️ Hope you learned something!
