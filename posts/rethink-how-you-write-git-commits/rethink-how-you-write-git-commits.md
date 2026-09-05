---
title: Rethink How You Write Git Commits
description: Write more clear, and meaningful commits, with less effort.
slug: rethink-how-you-write-git-commits
published: '2021-5-29'
category: git
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
</script>

## Table of Contents

## How to Write a Git Commit Message

There are no set rules how you should structure a commit message. As long as it's descriptive, and clear. I'm often guilty of writing horrible non-descriptive commit messages myself, after I'm left with no mental energy to distill succinctly what I've done. You might write:

```shell:terminal
git commit -m "Added feature to add todos"
```

I prefer using the [imperative mood](https://en.wikipedia.org/wiki/Imperative_mood) way:

```shell:terminal
git commit -m "Add feature to add todos"
```

You often perform other [verb](https://en.wikipedia.org/wiki/Verb) actions on your Git history, using subcommands such as `git revert`.

> "The imperative mood is a grammatical mood that forms a command, or request."

You can learn more by reading [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) which inspired the title of this section.

Same as writing comments in your code — **try that your commits answer what, and why, instead of how.**

You can see the Git history, by saying `git log`. You're going to get a list ordered by most recent commits. Each commit is listed with a [SHA-1](https://en.wikipedia.org/wiki/SHA-1) checksum. Since it's long, we can just specify the first 8 characters.

This problem can be more pronounced, when not considering these things:

```shell:terminal
git log --pretty=oneline

# ca82a6df Added new feature
# 085bb3bc Fixed breaking changes
# a11bef06 Polishing
```

<Image src="confused.webp" alt="Person with a confused look on their face" />

Compared to being more clear, and descriptive:

```shell:terminal
git log --pretty=oneline

# ca82a6df Add feature to add todos
# 085bb3bc Fix bug in Safari that prevented adding a todo
# a11bef06 Add micro-interactions to improve the user experience
```

Which one do you prefer?

## Conventional Commits

The [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) is just an agreed upon convention with a simple set of rules for an explicit commit history.

- The commit should be prefixed with a type of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- The type prefix must be followed by a colon, and space
- After it you write a description (short summary of the code changes)

```shell:terminal
git commit -m "feat: Add todo"
```

```shell:terminal
git log --pretty=oneline

# ca82a6df feat: Add todo
# 085bb3bc fix: Solve bug in Safari that wouldn't add a todo
# a11bef06 style: Add micro-interactions to improve the user experience
```

You don't have to strictly adhere to it. I use a `types` type, when I'm working with TypeScript type definitions.

I prefer capitalizing the description. It doesn't matter what you prefer, as long as you're consistent. Sometimes a project you're contributing to doesn't have rules. In that case, I first look at how they structure their project, so it's consistent.

There's other reasons why this system is useful:

- You can have automatically generated changelogs
- Semantic versioning is done for you (since it can understand what type of change you've made based on the type)
- It's self-explanatory, so anyone can understand it
- Having a more structured commit history makes contribution to your project easier

## Using the VS Code Extension

You can use the [Conventional Commits extension](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits). It makes it simple to write commits, in a couple of steps, using a dialogue. Pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd> brings us to the source control panel:

<Image src="git.png" alt="Arrow pointing to the location of Conventional Commmits inside VS Code" />

You can select the type of change:

<Image src="options.png" alt="Dialogue with options for type of commit" />

There's even emoji options:

<Image src="gitmoji.png" alt="Dialogue with options for emojis" />

After you're done, and do a `git log`:

<Image src="commit.png" alt="Shows git log, after creating a conventional commit" />

Congrats!

## Conclusion

This is a great way to get started, but after a while you're going to notice how slow it feels. At that point you have already memorized, and read the descriptions for the options.

I suggest you get comfortable using your terminal, if you already aren't. I use a mix of both, as sometimes I prefer the visual feedback, such as looking at the difference between two files after I've made changes.

Read you later.
