<script lang="ts">
	import { WebSandbox } from '@sveltecraft/sandbox'
</script>

<div class="sandbox">
	<WebSandbox
		height={400}
		code={{
			html: `
				<p>click a box to remove it</p>

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
					text-align: center;
					background-color: #1b1e27;
					color-scheme: dark;
				}

				.boxes {
					display: flex;
					gap: 0.5rem;

					.box {
						width: clamp(60px, 20dvw, 100px);
						height: clamp(60px, 20dvw, 100px);
						background: #00ffcc;
						border-radius: 0.5rem;
						transition:
							opacity 0.5s,
							translate 0.5s,
							background 0.5s,
							display 0.5s allow-discrete;
						transition-delay: calc(0.1s * sibling-index());

						@starting-style {
							opacity: 0;
							translate: 0 20px;
						}

						&[hidden] {
							display: none;
							opacity: 0;
							translate: 0 20px;
						}
					}
				}
			`,
			script: `
				document
					.querySelector('.boxes')
					.addEventListener('click', (e) => {
						const box = e.target.closest('.box');
						if (!box) return;
						box.hidden = true;
						box.ontransitionend = () => box.remove();
					});
			`,
		}}
	/>
</div>

<style>
	.sandbox {
		margin-bottom: 2rem;
	}
</style>
