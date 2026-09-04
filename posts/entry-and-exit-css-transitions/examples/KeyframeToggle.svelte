<script lang="ts">
	import { WebSandbox } from '@sveltecraft/sandbox'
</script>

<div class="sandbox">
	<WebSandbox
		height={400}
		code={{
			html: `
				<div class="toggle">
					<input type="checkbox" id="toggle" checked />
					<label for="toggle">
						<span>Toggle Keyframes</span>
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
					animation: fadeIn 0.8s forwards;
					animation-delay: calc(0.1s * sibling-index());
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
						background: #00ffcc;
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
						background: #00ffcc;
						border-radius: 0.5rem;
						opacity: 0;
						translate: 0 20px;
					}
				}

				@keyframes fadeIn {
					to {
						opacity: 1;
						translate: 0 0;
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
