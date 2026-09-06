<script lang="ts">
	import { WebSandbox } from '@sveltecraft/sandbox'
</script>

<div class="sandbox">
	<WebSandbox
		height={400}
		code={{
			html: `
				<button class="show">
					Open Modal
				</button>

				<dialog>
					<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExenhpdjk1c3lybTI5cjVuYWEzaDYxNnc1NDA2eXpzMXdtNnY1YnpkNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lgcUUCXgC8mEo/giphy.gif" />
					<button class="close">Close</button>
				</dialog>
			`,
			css: `
				body {
					display: grid;
					place-content: center;
					background-color: #1b1e27;
					color-scheme: dark;
				}

				button {
					margin: 0;
					padding: 1rem;
					font-weight: 600;
					color: #fff;
					background: #1d1f24;
					border: 1px solid #2c2e33;
					border-radius: 0.5rem;

					&.close {
						margin-top: 1rem;
					}
				}

				dialog {
					margin: auto;
					padding: 1rem;
					border-radius: 0.5rem;
					color: #fff;
					background: #191a1f;
					border: 1px solid #2c2e33;

					translate: 0 100svh;
					transition:
						translate 1s,
						overlay 1s allow-discrete,
						display 1s allow-discrete;

					img {
						border-radius: 0.5rem;
					}
				}

				dialog:open {
					translate: 0 0;

					@starting-style {
						translate: 0 -100svh;
					}
				}

				dialog::backdrop {
					background-color: transparent;
					transition:
						display 1s allow-discrete,
						overlay 1s allow-discrete,
						background-color 1s;
				}

				dialog:open::backdrop {
					background-color: oklch(0% 0 0 / 50%);
				}

				@starting-style {
					dialog:open::backdrop {
						background-color: transparent;
					}
				}
			`,
			script: `
				const show = document.querySelector('.show');
				const close = document.querySelector('.close');
				const dialog = document.querySelector('dialog');

				show.addEventListener('click', () => {
					dialog.showModal();
				});

				close.addEventListener('click', () => {
					dialog.close();
				});

				dialog.addEventListener('click', (e) => {
					if (e.target === dialog) {
						dialog.close();
					}
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
