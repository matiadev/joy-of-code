<script lang="ts">
	import { Bluesky, Mail, RSS, X, YouTube } from '#lib/icons/index.js'
	import * as config from '#lib/site/config.js'
</script>

<footer>
	<div class="follow">
		<p>Follow</p>
		<ul>
			<li>
				<a href="/newsletter">
					<Mail width={20} height={20} aria-hidden={true} />
					<span>Newsletter</span>
				</a>
			</li>
			<li>
				<a href={config.youtube} target="_blank" rel="noreferrer">
					<YouTube width={20} height={20} aria-hidden={true} />
					<span>YouTube</span>
				</a>
			</li>
			<li>
				<a href={config.twitter} target="_blank" rel="noreferrer">
					<X width={20} height={20} aria-hidden={true} />
					<span>Twitter</span>
				</a>
			</li>
			<li>
				<a href={config.bluesky} target="_blank" rel="noreferrer">
					<Bluesky width={20} height={20} aria-hidden={true} />
					<span>Bluesky</span>
				</a>
			</li>
			<li>
				<a href="/rss.xml" target="_blank">
					<RSS width={20} height={20} aria-hidden={true} />
					<span>RSS</span>
				</a>
			</li>
		</ul>
	</div>

	<div class="other">
		<p>Other</p>
		<ul>
			<li><a href="/about">About</a></li>
			<li>
				<a href={config.uses} target="_blank" rel="noreferrer">Uses</a>
			</li>
		</ul>
	</div>
</footer>

<style>
	footer {
		--gap: var(--spacing-64);

		display: flex;
		flex-direction: column;
		gap: var(--gap);
		margin-block-start: var(--spacing-64);
		padding: var(--spacing-32);
		background-color: var(--clr-footer-bg);
		border: 1px solid var(--clr-menu-border);
		border-radius: var(--rounded-20) var(--rounded-20) 0px 0px;

		@media (width >= 600px) {
			--gap: var(--spacing-128);
			flex-direction: row;
			padding-inline: var(--spacing-128);
		}

		p {
			font-weight: 700;
		}

		ul {
			width: max-content;
			display: grid;
			grid-template-rows: repeat(5, 1fr);
			grid-auto-flow: column;
			column-gap: var(--spacing-32);
			row-gap: var(--spacing-16);
			margin-top: var(--spacing-16);

			li a {
				display: flex;
				align-items: center;
				gap: var(--spacing-8);
			}
		}

		li a {
			font-weight: inherit;
			color: var(--clr-footer-txt);

			&:hover {
				color: var(--clr-primary);
			}
		}
	}
</style>
