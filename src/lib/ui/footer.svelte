<script lang="ts">
	import { Bluesky, Mail, RSS, X, YouTube } from '#lib/icons/index.js'
	import * as config from '#lib/site/config.js'
</script>

<footer
	class="mt-16 flex flex-col gap-16 rounded-t-2xl border border-menu-border bg-footer p-8 min-[600px]:flex-row min-[600px]:gap-32 min-[600px]:px-32"
>
	<div class="follow">
		<p class="font-bold">Follow</p>
		<ul
			class="mt-4 grid w-max auto-cols-auto grid-flow-col grid-rows-5 gap-x-8 gap-y-4 [&_a]:flex [&_a]:items-center [&_a]:gap-2"
		>
			<li>
				<a href="/newsletter" class="text-footer-fg hover:text-primary">
					<Mail width={20} height={20} aria-hidden={true} />
					<span>Newsletter</span>
				</a>
			</li>
			<li>
				<a
					href={config.youtube}
					target="_blank"
					rel="noreferrer"
					class="text-footer-fg hover:text-primary"
				>
					<YouTube width={20} height={20} aria-hidden={true} />
					<span>YouTube</span>
				</a>
			</li>
			<li>
				<a
					href={config.twitter}
					target="_blank"
					rel="noreferrer"
					class="text-footer-fg hover:text-primary"
				>
					<X width={20} height={20} aria-hidden={true} />
					<span>Twitter</span>
				</a>
			</li>
			<li>
				<a
					href={config.bluesky}
					target="_blank"
					rel="noreferrer"
					class="text-footer-fg hover:text-primary"
				>
					<Bluesky width={20} height={20} aria-hidden={true} />
					<span>Bluesky</span>
				</a>
			</li>
			<li>
				<a
					href="/rss.xml"
					target="_blank"
					class="text-footer-fg hover:text-primary"
				>
					<RSS width={20} height={20} aria-hidden={true} />
					<span>RSS</span>
				</a>
			</li>
		</ul>
	</div>

	<div class="other">
		<p class="font-bold">Other</p>
		<ul
			class="mt-4 grid w-max auto-cols-auto grid-flow-col grid-rows-5 gap-x-8 gap-y-4"
		>
			<li>
				<a href="/about" class="text-footer-fg hover:text-primary">About</a>
			</li>
			<li>
				<a
					href={config.uses}
					target="_blank"
					rel="noreferrer"
					class="text-footer-fg hover:text-primary"
				>
					Uses
				</a>
			</li>
		</ul>
	</div>
</footer>
