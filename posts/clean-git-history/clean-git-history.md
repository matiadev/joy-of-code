---
title: Clean Git History Using Rebase
description: How to have a clean Git history using rebase.
slug: clean-git-history
published: '2021-6-7'
category: git
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
</script>

## Table of Contents

## Before You Get Started

Recently I wrote about [how you should rethink your Git commits](https://joyofcode.xyz/rethink-how-you-write-git-commits) where I explain the benefits of having a readable Git history.

I want to go a step further and show you how to have complete control over your Git history. Rewrite it, keep a linear project history and integrate upstream changes.

I find most explanations confusing because they spend time explaining features instead of showing you how to use the feature. That's why I encourage you to practice what you read.

Initialize a Git repository inside an empty folder:

```shell:terminal
# initialize new Git project
git init

# add empty commit
git commit --allow-empty -m "Start of project"

# rename branch "master" to "main"
git branch -m master main
```

Set your code editor as the default Git editor:

```shell:terminal
# check if you have your editor set up
git config --get core.editor

# set default editor to VS Code
git config --global core.editor "code --wait"
```

Learn more from the [VS Code as Git Editor](https://code.visualstudio.com/docs/editor/versioncontrol#_vs-code-as-git-editor) documentation. If you are using another editor you can see [a list of configuration commands](https://git-scm.com/book/en/v2/Appendix-C%3A-Git-Commands-Setup-and-Config).

We are using the [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) VS Code extension to get a visual representation of our Git history.

## What is Git Rebase?

Git rebase specializes in integrating changes from one branch to another:

- Rebase can **rewrite history** and **alter individual commits**
- **Integrate changes back into your feature branch** so you're up to date
- **Integrate feature branch changes** into the main branch
- It's **easier reasoning** about Git history

## Using Git Rebase to Rewrite History

This is a contrived example for sake of learning. We're not going to write actual code.

We're tasked to add a feature to display a list of Pokemon. The steps required include:

- Creating a `feature/pokemon` branch
- Adding a `pokemon.js` and `styles.css` file

```shell:terminal
git checkout -b feature/pokemon
```

Your terminal and editor indicate you're on the right branch:

<Image src="vs-code.png" alt="VS Code Editor" />

Add the `pokemon.js` file:

```js:pokemon.js
// Fetch, and display Pokemon
```

Stage and commit the file:

```shell:terminal
git add pokemon.js
git commit -m "feat: Fetch, and display Pokemon"
```

Do the same for `styles.css`:

```css:styles.css
/* Pokemon styles */
```

```shell:terminal
git add styles.css
git commit -m "style: Add Pokemon styles"
```

<Image src="first-commits.png" alt="Shows first couple of commits" />

At this stage, we could do `git checkout main` and `git merge feature/pokemon` to merge the changes.

Let's look at the Git log:

```shell:terminal
git log --oneline

# fd9eb31 (HEAD -> feature/pokemon) style: Add Pokemon styles
# 3e2fc0a feat: Fetch, and display Pokemon
# 3c03f44 Start of project
```

If we merged the changes:

```shell:terminal
git log --oneline

# fd9eb31 (HEAD -> main, feature/pokemon) style: Add Pokemon styles
# 3e2fc0a feat: Fetch, and display Pokemon
# 3c03f44 Start of project
```

If you're playing around and make a mistake you can always do `git reset --hard fd9eb317` which would bring you back in Git history. Your commit hash would be different.

After we're done merging the changes we should remove the branch with `git branch -d feature/pokemon` since we no longer need it (you will have to repeat the previous steps if you do it).

<Image src="first-merge.png" alt="Shows first couple of commits" />

Instead of using merge, let us use **interactive rebase**.

This gives us the ability to **alter** and even **reorder** our commits if we wanted to:

- **We don't have to include a bunch of random commits** into our Git history for a feature
- Instead, we can **squash** them into a single commit

Let's take a look at the Git log so we understand what we want to accomplish:

```shell:terminal
git log --oneline

# c36072d (HEAD -> main) style: Add Pokemon styles
# a3a28ed feat: Fetch, and display Pokemon
# 3c03f44 Start of project
```

Wouldn't it be nicer if we could have only one feature commit that includes everything we have done? This is possible with rebase.

```shell:terminal
# c36072d (HEAD -> main) feat: Add Pokemon
# 3c03f44 Start of project
```

Let's go back to our branch using `git checkout feature/pokemon` and start the rebase:

```shell:terminal
git rebase -i HEAD~2
```

The `-i` command-line parameter says: "run rebase in interactive mode". The `HEAD~2` specifies the last two commits in our Git history.

<Image src="rebase-open.png" alt="Shows rebase window" />

You can ignore most of the output unless you want to read it. What's important are our commits at the top.

The most useful thing to us is:

- The ability to **edit a commit message**
- **Reorder** the commits
- **Squash** commits into a single commit

Let's take a look at the top of the file:

```shell:editor
# pick 0970ca5 feat: Fetch, and display Pokemon
# pick 6b144c0 style: Add Pokemon styles
```

**When squashing you leave the top commit alone.** We change "pick" to "squash" for others, or use the abbreviation:

```shell:editor
# pick 0970ca5 feat: Fetch, and display Pokemon
# squash 6b144c0 style: Add Pokemon styles
```

After you're done save the file and close it. Another file is going to open. This is where we change the commit message.

<Image src="rebase-commit.png" alt="Shows rebase commit message window" />

We can delete most of it and enter our commit message. Close it after you're done.

<Image src="rebase-commit-change.png" alt="Shows rebase commit change" />

If we change our mind we can <kbd>Ctrl</kbd> + <kbd>C</kbd> to stop what we're doing. We can stop the rebase at any point with `git rebase --abort`. After resolving any conflicts we use `git rebase --continue`.

We are still on the `feature/pokemon` branch so let's `git checkout main`.

<Image src="rebase-checkout.png" alt="Shows checkout to main branch after rebase" />

The only thing left to do is rebase the changes:

```shell:terminal
git rebase feature/pokemon
```

<Image src="rebase-complete.png" alt="Shows completed rebase on main branch" />

That's it. Rebase is one of my favorite Git features. It's very powerful since it let's us have a Git History we can reason about.

Note that if you're working with a remote branch and want to push changes you have to force push the changes with `git push -f` (**to your branch only**) which is fine if you read the next section. You can push your branch with `git push origin feature/pokemon`.

## When Not to Use Rebase

- **Never use rebase on a public branch** (you shouldn't rewrite the history for others and cause problems by force pushing)
- **Only use rebase if you're the only person working on a branch** (this is why it's acceptable to force push your changes to a remote branch)
- **Try to keep things local** so you can do whatever you want

## Using Rebase to Keep Your Branch Up To Date

Let's say we're working on the Pokemon feature. Our crack team of backend developers is working hard on implementing the API. Since it's not ready we had to use a mock API during the development of the feature.

At one point our **feature branch** is going to get behind our main branch:

<Image src="feature-behind-upstream.png" alt="Shows feature branch is behind upstream" />

The above example shows how the "feat: Add Pokemon API" commit was pushed to our main branch meaning our feature branch is behind.

```shell:terminal
git log --oneline

# 7b9cdee (HEAD -> feature/pokemon) style: Add Pokemon styles
# 691dbc5 feat: Fetch, and display Pokemon
# 3c03f44 Start of project
```

How do we base our changes on the latest commit?

- We could always merge the changes using `git pull` which is shorthand for `git fetch` followed by `git merge origin main`
- This would leave a merge commit that's not useful to our history
- We can use `git rebase` instead

If we're on the `feature/pokemon` branch we can do a manual rebase:

```shell:terminal
git rebase main
```

<Image src="feature-behind-rebase.png" alt="Shows feature branch up to date with upstream" />

```shell:terminal
git log --oneline

# 47c17c4 (HEAD -> feature/pokemon) style: Add Pokemon styles
# df60798 feat: Fetch, and display Pokemon
# 95a14c5 (main) feat: Add Pokemon API
# 3c03f44 Start of project
```

We don't have to do anything else like we did with the interactive rebase. From here we can do an interactive rebase and make further changes to our feature branch.

After we're done we have to switch to the main branch `git checkout main` and do a manual rebase `git rebase feature/pokemon` followed by removing the branch `git branch -d feature/pokemon`.

If the branch is remote you also have to remove it from GitHub.

## Conclusion

You can always go back in time if you make a mistake. That includes altering the Git history. It only appears your old commits are gone. They're not. You can restore and even undo the rebase with [Git reflog](https://www.atlassian.com/git/tutorials/rewriting-history/git-reflog).

Thank you for reading and have a nice day!
