<script lang="ts">
	let { published, editUrl } = $props()

	function isOverOneYearOld(dateString: string) {
		const initialDate = new Date(dateString)
		const currentDate = new Date()

		const initialDateNextYear = new Date(
			initialDate.getFullYear() + 1,
			initialDate.getMonth(),
			initialDate.getDate()
		)

		return currentDate >= initialDateNextYear
	}

	function postWarning(published: string, editUrl: string) {
		const warningEl = document.createElement('blockquote')
		warningEl.innerHTML = `⚠️ This post is over a year old, and some of the information may be outdated. If you find any errors, please <a href="https://github.com/mattcroat/joy-of-code/issues" target="_blank" rel="noreferrer" style="text-decoration: underline">submit an issue</a> or <a href="${editUrl}" target="_blank" rel="noreferrer" style="text-decoration: underline">edit the post on GitHub</a>.`
		warningEl.style.margin = 'var(--spacing-32) 0px 0px 0px'
		warningEl.style.color = '#ffeb00'
		warningEl.style.backgroundColor = '#222700'
		warningEl.style.borderTopColor = '#ffff00'

		if (isOverOneYearOld(published)) {
			try {
				const heading = document.querySelectorAll('h2')[1]
				heading.insertAdjacentElement('beforebegin', warningEl)
			} catch (e) {
				console.error(e)
			}
		}
	}

	$effect(() => {
		postWarning(published, editUrl)
	})
</script>
