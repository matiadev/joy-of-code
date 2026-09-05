---
title: How to Think Like a Developer
description: Learn how to develop problem solving skills.
slug: how-to-think-like-a-developer
published: '2020-12-24'
category: general
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
</script>

## Table of Contents

## Introduction

You learned JavaScript. Maybe you watched a course. You felt confident in your abilities. The voice is gone. There's silence. You open your editor with a blank stare. You feel lost. What now?

<Embed src="https://vanilla-todo-examples.netlify.app/05-final-version/" title="Vanilla Todo" />

[Source code](https://github.com/joysofcode/vanilla-todo) on GitHub.

## Disillusion

Have you watched a cooking show? The chef makes it look easy. Behind the scenes there's a lot of people responsible for that. Someone needs to scrub the pans, taste test, and style the food before they present it to you. Tutorials are like a cooking show where they can set unrealistic expectations, and make you feel like you don't get it. They give you the false impression the person knows everything. You'll be relieved to know. They don't! They're just great cooks.

Don't compare yourself with the experience of someone else. It takes time and practice.

> _“Talent is a pursued interest. Anything that you're willing to practice, you can do.”_ ― Bob Ross

You might have heard well intentioned things such as _"just go work on projects"_. It's easier said than done. Where do you start?

These are tools, and techniques for your mind to reason about code. I want to give you confidence. Instead of feeling stuck and frustrated, you're going to get excited about learning.

## The Project

I like the idea behind the [TodoMVC](http://todomvc.com/) project. We're going to create a similar todo app. The styles are going to be simple. They're included in the [source code](https://github.com/joysofcode/vanilla-todo), so we can focus on what's important.

## Breaking Down Problems

I want you to think for a second. How would you build something like this? The answer may be different based on your experience. We often look at things like they're a black box. _"I don't understand it, so I shouldn't bother"_. Everything is just a sum of it parts. We can break it down into managable pieces.

A todo app is a simple create, read, update, delete ([CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)) application. It's the basis of everything. Think of huge sites like Reddit, Instagram, Facebook, or Twitter. It's just a CRUD app with extra sauce.

A todo app has all the right fundamentals. Regardless of language, or framework you're learning. It's a great barometer that shows you how it works.

Your first impulse might be opening your editor and starting to code something up. That's a frequent mistake. Step back for a moment and think of the requirements.

## Requirements

- Input field for the todo
- Displaying the todos
- Create todo
- Update todo
- Delete todo

That's it! Nothing crazy. Notice how we're missing the _read_ part of CRUD. We're just going to use an object to keep it simple. We can treat it as our database.

## Getting Started

The best way of learning is through doing. You can use [Codepen](https://codepen.io/pen) to get started.

Avoiding mental hurdles of having to open an editor, and having a quick way to hack on something is great, because it encourages us to play and learn.

## The User Input

Let's just add an input.

```html:index.html
<input
  type="text"
  class="todo-input"
  placeholder="What needs to be done?"
  data-input
/>
```

[Data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) allow us to store extra information on HTML elements in the form of `data-*` where _star_ could be named anything.

I prefer to use data attribute to hook into things with JavaScript over _id_ that should be unique, or _class_ because class names could change since they're used for styles.

## Reading the Value

Say we don't know anything about the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (Document Object Model). The DOM might be a metaphor for something else you're having trouble with. You might not even known how to _select_ the element itself.

Are we just stuck? You might be tempted to watch a video. I've even seen people drop everything, and go spend weeks on a course. They're both valid ways to learn.

Let's practice troubleshooting instead. We can always go the path of least resistance if we don't understand the answers. I find bad documentation is the leading cause in why we avoid doing it.

We can just tell the search engine what we want. In this case _"How do I select an element in JavaScript"_, or _"How do I get the value from an input field in JavaScript?"_. You also don't have to be that verbose. The search engine isn't human. Use keywords such as _"JavaScript select element"_, or _"JavaScript input value"_.

You'll often find great [Stack Overflow](https://stackoverflow.com/) threads. The only caution is try finding a recent one since the language evolves. This is not just true for JavaScript.

Select the input element:

```js:app.js
const inputEl = document.querySelector('[data-input]')
```

```js:example.js
const inputValue = inputEl.value
```

You're actively learning, and problem solving just like you'd do on the job. This makes it stick.

## Thinking in Data Structures

Looking at a problem might feel the same as looking at abstract art. There's confusion around how we display, and update the data based on some user action. It would be easier if we had a place to store the `state` of our app.

It could hold our todos. For example we can keep track if they're completed so we can `filter` them later based on criteria. We can keep track how many there are by using the `length` property.

A state for our todos might look like this:

```js:app.js showLineNumbers
let todos = [
  {
    id: 1,
    todo: 'Refund Cyberpunk',
    completed: false,
  },
  {
    id: 2,
    todo: 'Pre-order KFConsole',
    completed: false,
  },
]
```

We can quickly model the state of our app how we want. I hope you see how coding can be creative. There's no rigid rules how this should work. It's just a concept.

This is also known as having a [single source of truth](https://en.wikipedia.org/wiki/Single_source_of_truth). You're going to hear this one a lot.

## See How it Looks First

It's easier to see how things should look first. After that it's easier to translate to code. I always do this first. When it's complete, you can remove it. This way you always have a reference to what you're doing.

Our HTML for the todo list might look something like:

```html:index.html
<div class="todos" data-todos>
  <ul>
    <li class="todo" data-todo="1">
      <input class="todo-checkbox" type="checkbox" />
      <label class="todo-label" data-todo-label>Refund Cyberpunk</label>
    </li>

    <li class="todo" data-todo="2">
      <input class="todo-checkbox" type="checkbox" />
      <label class="todo-label" data-todo-label>Pre-order KFConsole</label>
    </li>
  </ul>
</div>
```

Note: I'm keeping the markup to a minimum. You should be more conscious when working on your own projects, so it's accessible.

## Displaying Todos

<Embed src="https://vanilla-todo-examples.netlify.app/01-show-todos/" title="Vanilla Todo" />

The next thing to do is loop over our todo list items and display them:

```js:app.js showLineNumbers
const todosHTML = `
  <ul>
    ${todos.map(({ id, todo }) => {
      return `
        <li class="todo" data-todo="${id}">
          <input class="todo-checkbox" type="checkbox">
          <label class="todo-label" data-todo-label>${todo}</label>
        </li>
      `
    }).join(' ')}
  </ul>
`
```

Instead of creating the elements using `document.createElement` we're using [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to keep it simple.

Here I'm just picking values I want being `id`, `todo` from the `todos` object. The `join` is required because `map` returns an array, which we need to turn into a string. For example `['Todo', 'Todo'].join(' ')` would return `'Todo Todo'`.

Always `console.log` things to see what they are.

Here's how we grab the output, and display todos inside it:

```js:app.js showLineNumbers
const inputEl = document.querySelector('[data-input]')
const todoListEl = document.querySelector('[data-todos]')

const todosHTML = `
  <ul>
    ${todos.map(({ id, todo }) => {
      return `
        <li class="todo" data-todo="${id}">
          <input class="todo-checkbox" type="checkbox">
          <label class="todo-label" data-todo-label>${todo}</label>
        </li>
      `
    }).join(' ')}
  </ul>
`

todoListEl.innerHTML = todosHTML
```

**It's tempting to want to break things into neat functions and doubting if what you're doing is right. Don't. Focus on making your code work first. You can improve it later.**

Great job! I hope everything so far makes sense.

## Wishful Thinking

You're close to an artist in the way which you can express yourself through code. You can make up anything, and make things work the way you want. There's no right or wrong. **Instead of clean code, focus on working code.** You're always going to learn, and cringe the month later at your old code.

"Wishful thinking" is a great practice where you write code such as a function like it has already been done, and you return later to implement it.

For example `updateUI` where it clears the todo input field, creates an updated _"template"_ of todos to display in the browser that we can use anywhere we need to update the user interface. How cool is that? You just made that up from your mind 🤯

```js:app.js showLineNumbers
function updateUI() {
  inputEl.value = ''

  const todosHTML = `
    <ul>
      ${todos
        .map(({ id, todo }) => {
          return `
            <li class="todo" data-todo="${id}">
              <input class="todo-checkbox" type="checkbox">
              <label class="todo-label" data-todo-label>${todo}</label>
            </li>
          `
        })
        .join(' ')}
    </ul>
  `

  todoListEl.innerHTML = todosHTML
}
```

## Pseudocode

Another great technique is writing [pseudocode](https://en.wikipedia.org/wiki/Pseudocode) to help us think through a problem. While pseudocode by definition is "a notation resembling a simplified programming language". We can just write comments.

```js:app.js showLineNumbers
function addTodo() {
  // do nothing if input is empty

  // create a todo object with id, todo, completed

  // push the todo to todos

  // update the user interface
}
```

## Create Todo

<Embed src="https://vanilla-todo-examples.netlify.app/02-create-todo/" title="Vanilla Todo" />

Let's implement it:

```js:app.js showLineNumbers
function addTodo() {
  if (!inputEl.value) return

  const todo = {
    id: todos.length + 1,
    todo: inputEl.value,
    completed: false
  }

  todos.push(todo)

  updateUI()
}
```

First we check if the input is empty, if so we don't do anything. We only have to grab the latest input value, and push the same formatted object to our list of `todos`. We get the `id` by looking at how many todos we have. After we modify our state, we pass whatever current `todos` are to `updateUI` to update the user interface.

Let's make it so that our todo gets added when the user presses _enter_. We already have the reference to `inputEl`.

Let's add a `keypress` event listener:

```js:app.js showLineNumbers
inputEl.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTodo()
  }
})
```

That's it!

## Update Todo

<Embed src="https://vanilla-todo-examples.netlify.app/03-update-todo/" title="Vanilla Todo" />

It's not enough to just read something once, and think you get it. It takes deliberate effort to try it out yourself until you understand it.

Since we're creating elements on the fly, it's not that straightforward to add event listeners to them. We have to add them after they've been created.

We could loop over each element to attach event listeners, but it's easier to use [event delagation](https://javascript.info/event-delegation).

It's great when you have a lot of elements. Event delegation is having a listener on the parent, instead of it's children. We can determine what todo item we clicked on.

For editing the todo:

- I want the update input to be hidden by default
- When we click on the button I want it to hide the todo input, and show the update input
- Update the todo input text as we type, so after we're done we can see the change
- If we click outside the update input, or it loses focus we're done editing so we hide the update input, and show the todo input
- Update `todos` state

You can see this in the finished version. It's similar to TodoMVC. Only I'm avoiding making it look fancy, so we don't have to think about the styles. When we break things down, everything is a lot more managable.

Let's add an input, and update button:

```js:app.js showLineNumbers
function updateUI() {
  inputEl.value = ''

  const todosHTML = `
    <ul>
      ${todos
        .map(({ id, todo }) => {
          return `
            <li class="todo" data-todo="${id}">
              <input class="todo-checkbox" type="checkbox">
              <label class="todo-label" data-todo-label>${todo}</label>

              <input class="todo-update" style="display: none" data-update-input />
              <button class="todo-update-toggle" data-update-btn>✏️</button>
            </li>
          `
        })
        .join(' ')}
    </ul>
  `

  todoListEl.innerHTML = todosHTML
}
```

I'm adding inline styles here for simplicity. In the final version they're located in the stylesheet for `.todo-update` styles.

Our goal is to be able to click on the button, and grab the reference to the `id`, along with the value of the update input that we can send to `updateTodo` that's going to accept `todoId` and `updatedTodoValue` as arguments so it updates our state and user interface.

The event handler has to come after we update state:

```js:app.js showLineNumbers
function updateUI() {
  inputEl.value = ''

  const todosHTML = `
    <ul>
      ${todos
        .map(({ id, todo }) => {
          return `
          <li class="todo" data-todo="${id}">
            <input class="todo-checkbox" type="checkbox">
            <label class="todo-label" data-todo-label>${todo}</label>

            <input class="todo-update" style="display: none" data-update-input />
            <button class="todo-update-toggle" data-update-btn>✏️</button>
          </li>
        `
        })
        .join(' ')}
    </ul>
  `

  todoListEl.innerHTML = todosHTML

  todoListEl.onmouseover = () => {
    // ...
  }
}
```

We're using an event handler `element.onmouseover`, instead of an event listener `element.addEventListener('mouseover', callback)` so we don't have to clean it up each time doing `element.removeEventListener('mouseover', callback)`. And the reason behind why `mouseover` is so we can immediately set things like event handlers.

It's going to give us access to the `event` object which we get `event.target` from. To know which todo the user clicked on, we're going to use the `closest` method to get the parent element. With that we can query and element inside, and do whatever. If you're confused at any point, remember to `console.log` everything.

```js:app.js showLineNumbers
function updateUI() {
  // ...

  todoListEl.onmouseover = ({ target }) => {
    // get the closest parent which is going to be <li>...</li>
    const parentEl = target.closest('[data-todo]')

    // if there's no parent do nothing
    if (!parentEl) return

    // get the id by accessing the data attribute value
    // for example data-todo='1'
    const todoId = +parentEl.dataset.todo

    // query the label, input, button elements
    const labelEl = parentEl.querySelector('[data-todo-label]')
    const inputEl = parentEl.querySelector('[data-update-input]')
    const btnUpdateEl = parentEl.querySelector('[data-update-btn]')

    // when we click the pencil show the update input
    // and hide the todo label
    btnUpdateEl.onclick = () => {
      labelEl.style.display = 'none'
      inputEl.style.display = 'inline'

      // places the cursor in the input
      // for a greater user experience
      inputEl.focus()
    }

    // update the todo label to match the change
    inputEl.onkeyup = () => {
      labelEl.innerText = inputEl.value
    }

    // when the input loses focus hide the update input
    // and show the todo label again
    inputEl.onblur = () => {
      labelEl.style.display = 'inline'
      inputEl.style.display = 'none'

      // clear the input
      inputEl.value = ''

      // update todos state
      const updatedTodos = updateTodo(todoId, inputEl.value)
      todos = updatedTodos
    }
  }
}
```

Take a stretch! Let it sink in. Another great advice is if you can't figure out something, take a break. Your brain is going to work on the problem in the background.

I'm going to explain how `updateTodo` works:

```js:app.js showLineNumbers
function updateTodo(todoId, updatedTodoValue) {
  return todos.map((todo) => {
    if (todoId === todo.id) {
      return {
        ...todo,
        todo: updatedTodoValue,
      }
    }

    return {
      ...todo,
    }
  })
}
```

Let's break it down. To update a todo item we need to know which todo we need to update. We need to pass it the `todoId`, and `updatedTodoValue` to replace the old todo.

**Focus at the problem at hand. Take what you don't understand, and isolate it in a separate environment.**

```js:example.js showLineNumbers
let todos = [
  {
    id: 1,
    todo: 'Refund Cyberpunk',
    completed: false
  },
  {
    id: 2,
    todo: 'Pre-order KFConsole',
    completed: false
  }
]
```

How do we update this? We not only have to update the todo, but keep the _rest_. Let's just hardcode the `id` so we know it works.

```js:example.js showLineNumbers
todos.map(todo => {
  if (todo.id === 1) {
    console.log(todo)
  }
})
```

Alright, we get our todo! Now we need to update the `todo` in our object:

```js:example.js showLineNumbers
todos.map(todo => {
  if (todo.id === 1) {
    return {
      todo: 'Edited todo'
    }
  }
})
```

But notice the object structure changed:

```js:example.js showLineNumbers
[
  {
    todo: 'Edited todo'
  }
]
```

What we have to do is keep the other keys on the todo object such as `id` and `completed`, and just modify the `todo` key:

```js:example.js showLineNumbers
todos.map(todo => {
  if (todo.id === 1) {
    return {
      ...todo,
      todo: 'Edited todo'
    }
  }
})
```

We can achieve this by using the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

```js:example.js showLineNumbers
[
  {
    id: 1,
    todo: 'Edited todo',
    completed: false
  }
]
```

The order of the keys you're going to see in the output is going to be sorted alphabetical. We're not done yet! You might have noticed in the output that our other todo item is `undefined`. It's a similar problem, we're not saying it to include the _rest_.

```js:example.js showLineNumbers
todos.map(todo => {
  if (todo.id === 1) {
    return {
      ...todo,
      todo: 'Edited todo'
    }
  }

  return {
    ...todo
  }
})
```

Let's repeat:

- We loop over each `todo` item
- Modify the one that matched our `id` and return it
- Return the rest of the `todo` items

To make it even more clear to someone else reading the code we could write it as:

```js:example.js showLineNumbers
todos.map(todo => {
  let editedTodo = {}

  if (todo.id === 1) {
    editedTodo = {
      ...todo,
      todo: 'Edited todo'
    }
  }

  return {
    ...todo,
    ...editedTodo,
  }
})
```

Keep in mind, the order in which we return them is important!

## Delete Todo

<Embed src="https://vanilla-todo-examples.netlify.app/04-delete-todo/" title="Vanilla Todo" />

Great job! This part is going to be easy in comparison. We just need to pass in the todo _id_, and _filter_ the todo items. Then update the user interface.

Let's update our "template" with a delete button:

```js:app.js showLineNumbers
function updateUI() {
  // ...
  const todosHTML = `
    <ul>
      ${todos
        .map(({ id, todo }) => {
          return `
          <li class="todo" data-todo="${id}">
            <input class="todo-checkbox" type="checkbox">
            <label class="todo-label" data-todo-label>${todo}</label>

            <input class="todo-update" style="display: none" data-update-input />
            <button class="todo-update-toggle" data-update-btn>✏️</button>

            <button class="todo-delete" data-delete-btn>❌</button>
          </li>
        `
        })
        .join(' ')}
    </ul>
  `
  // ...
}
```

Next we need to query the delete button, and give it an event handler:

```js:app.js showLineNumbers
function updateUI() {
  // ...

  todoListEl.onmouseover = ({ target }) => {
    // ...
    const btnDeleteEl = parentEl.querySelector('[data-delete-btn]')
    btnDeleteEl.onclick = () => deleteTodo(todoId)
    // ...
  }
}
```

Lastly, this is how deleting a todo works:

```js:app.js showLineNumbers
function deleteTodo(todoId) {
  const filteredTodos = todos.filter(todo => todoId !== todo.id)
  todos = filteredTodos

  updateUI()
}
```

We didn't have to write it out first. We used _"wishful thinking"_.

Great job, we're done! 🎉

## Finding Project Ideas

Here are some resources:

- [JavaScript 30 ― Build 30 things in 30 Days](https://javascript30.com/)
- [100+ Javascript Projects Ideas](https://github.com/romeojeremiah/javascript-projects-for-beginners)
- [Practical JavaScript Project Ideas](https://simplestepscode.com/javascript-project-ideas/)
- [Vanilla Web Projects](https://github.com/bradtraversy/vanillawebprojects)

You don't have to master JavaScript. Do a couple of projects to get confident. That way you get an idea what problems frameworks solve.

## Reading Documentation

Don't be afraid of reading documentation. The [MDN Web Docs](https://developer.mozilla.org/en-US/) are your best friend if you want to learn how things work. Let's say you want to learn about the array method [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

Sometimes reading documentation can be tricky. Take for example the syntax examples MDN gives you.

```js:example.js showLineNumbers
let newArray = arr.map(callback(currentValue[, index[, array]]) {
  // return element for newArray, after executing something
}[, thisArg])
```

The first line with the brackets might be confusing. It's not JavaScript. It just means those `index`, `array` parameters are optional including `thisArg`.

This might look intidimating, but if we look at the examples we don't use half of the arguments. It just informs us what `map` accepts.

```js:example.js
[1, 2, 3, 4].map(number => console.log(number))
```

When documentation isn't helpful, you can look at code on GitHub. Great projects also tend to have an examples folder in their repository. Write down questions for each line of code you don't understand.

## Finding Help

You're going to encounter code you don't understand all the time. Take what you don't understand, and research it. If you don't know what the piece of code is doing you can ask on [Discord](https://discord.com/). Here's a list of [awesome discord communities](https://github.com/mhxion/awesome-discord-communities). You don't need to ask for permission to ask questions. Just be polite, and maybe read the guidelines of the server before you do.

## Conclusion

Don't think you understand something just because you watched it.

If you don't understand something, practice doing it. Let me explain. You don't want to practice remembering syntax. You can look that up. Practice the steps in your mind. Breaking things down into managable chunks. Your code could look completely different, but if it works be proud.

As a challenge you can display how many uncompleted todos are left, add the ability to filter by _active_, _completed_, and _all_. You could also learn the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) so you can preserve them through page reload.

Even the most complicated piece of code starts with a single line of code. This is how to get into the mindset of a developer.

Thanks for reading! 🏄️
