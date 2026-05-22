<script lang="ts">
	import { Sandbox } from '@sveltecraft/sandbox'
</script>

<div class="sandbox">
	<Sandbox
		height={400}
		code={{
			html: `
				<div class="toggle">
					<input type="checkbox" id="toggle" checked />
					<label for="toggle">
						<span>Toggle Transition</span>
					</label>
				</div>

				<div class="boxes">
					<div class="box"></div>
					<div class="box"></div>
					<div class="box"></div>
					<div class="box"></div>
				</div>
			`,
			css: `
				body {
					display: grid;
					place-content: center;
				}

				body:has(#toggle:checked) .box {
					opacity: 1;
					translate: 0 0;
				}

				.toggle {
					display: grid;
					place-content: center;
					margin-bottom: 2rem;

					input[type="checkbox"] {
						display: none;
					}

					#toggle:checked + label {
						color: #000;
						background: #ffff00;
					}

					label {
						display: flex;
						align-items: center;
						padding: 1rem;
						font-weight: 600;
						color: #fff;
						background: #1d1f24;
						border: 1px solid #2c2e33;
						border-radius: 0.5rem;
						transition: color 0.4s, background 0.4s;
					}
				}

				.boxes {
					display: flex;
					gap: 0.5rem;

					.box {
						width: clamp(60px, 20dvw, 100px);
						height: clamp(60px, 20dvw, 100px);
						background: #ffff00;
						border-radius: 0.5rem;
						opacity: 0;
						translate: 0 20px;
						transition: opacity 0.8s, translate 0.8s;
						transition-delay: calc(0.1s * sibling-index());

						@starting-style {
							opacity: 0;
							translate: 0 20px;
						}
					}
				}
			`,
		}}
	/>
</div>

<style>
	.sandbox {
		margin-bottom: var(--spacing-32);
	}
</style>
