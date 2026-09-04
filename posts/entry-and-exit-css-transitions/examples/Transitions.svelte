<script lang="ts">
	import { WebSandbox } from '@sveltecraft/sandbox'
</script>

<div class="sandbox">
	<WebSandbox
		height={400}
		code={{
			html: `
				<h2>@starting-style</h2>

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

				.boxes {
					display: flex;
					gap: 0.5rem;

					.box {
						width: clamp(60px, 20dvw, 100px);
						height: clamp(60px, 20dvw, 100px);
						background: #ffff00;
						border-radius: 0.5rem;
						transition: opacity 0.8s, translate 0.8s;
						transition-delay: calc(0.3s * sibling-index());

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
