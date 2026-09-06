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
					}
				}

				::view-transition-group(.box) {
					animation-delay: 0.3s;
				}

				::view-transition-new(enter) {
					animation: enter 0.5s;
				}

				::view-transition-old(leave) {
					animation: leave 0.5s forwards;
				}

				@keyframes enter {
					from { opacity: 0; translate: 0 20px; }
					to { opacity: 1; translate: 0 0; }
				}

				@keyframes leave {
					to { opacity: 0; translate: 0 20px; }
				}
			`,
			script: `
				document.querySelector('.boxes').addEventListener('click', (e) => {
					const box = e.target.closest('.box');
					if (!box) return;

					document.querySelectorAll('.box').forEach((b, i) => {
						const name = b === box ? 'leave' : \`box-\${i}\`;
						b.style.viewTransitionName = name;
						b.style.viewTransitionClass = 'box';
					});

					document.startViewTransition(() => box.remove());
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
