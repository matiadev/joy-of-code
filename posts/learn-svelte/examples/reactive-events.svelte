<script lang="ts">
	import { onMount } from 'svelte'
	import { createSubscriber } from 'svelte/reactivity'

	type Tween = [string | HTMLElement, window.gsap.TweenVars]

	class Timeline {
		#timeline = window.gsap.timeline()
		#subscribe

		constructor(tweens: Tween[]) {
			this.populateTimeline(tweens)
			this.#subscribe = createSubscriber((update) => {
				this.#timeline.eventCallback('onUpdate', update)
				return () => this.#timeline.eventCallback('onUpdate', null)
			})
		}

		populateTimeline(tweens: Tween[]) {
			onMount(() => {
				tweens.forEach(([element, vars]) => {
					this.#timeline.to(element, vars)
				})
			})
		}

		get time() {
			// makes it reactive when read inside an effect
			this.#subscribe()
			return this.#timeline.time()
		}

		set time(v) {
			this.#timeline.seek(v)
		}
	}

	const tl = new Timeline([
		['.box1', { x: 200, duration: 1 }],
		['.box2', { x: 200, duration: 1 }],
	])
</script>

<div class="container">
	<div class="box box1"></div>
	<div class="box box2"></div>

	<label>
		<span>Time:</span>
		<input bind:value={tl.time} type="range" min={0} max={2} step={0.01} />
	</label>
</div>

<style>
	.box {
		aspect-ratio: 1;
		width: 100px;
		margin-bottom: 0.5rem;
		background-color: orangered;
		border-radius: 1rem;
	}

	label {
		display: flex;
		gap: 0.5rem;
		margin-top: 2rem;
	}
</style>
