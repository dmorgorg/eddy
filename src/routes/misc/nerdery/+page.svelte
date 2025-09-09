<script>
	import Header from '$lib/components/Header.svelte';
</script>

<Header theme="#a00" />

<div class="container">
	<h3>Geometry Stuff</h3>
	<div>
		<p>
			It was geometry in high school that turned mathematics from something that didn't interest me
			into a lifelong passion. Nothing much here yet but stuff will creep in over time.
		</p>
		<br />
		<p>
			If the document is a .pdf file, it is best to download and view it in a laptop browser,
			stepping through the presentation for best results. Scrolling through on a phone just isn't
			the same!
		</p>
	</div>

	<ul>
		<li>
			<a href="/nerdery/Nerdery.pdf">Belt length</a>
			<a href="/nerdery/Nerdery.pdf" download>(Download .pdf)</a>
		</li>
	</ul>

	<div class="feedback eighty">
		Please send feedback and notification of typos or errors, etc., to
		<a href="mailto:bugs.eduk8r@gmail.com?subject=Step by Step Feedback">bugs.eduk8r@gmail.com</a>
	</div>
</div>

<style lang="scss">
	.container {
		align-items: center;
		background-color: transparent;
		// background-color: pink;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-inline: auto;
		width: 40rem;
	}
	h3,
	h4 {
		color: #a00;
	}
	a:link,
	a:visited,
	a:active {
		color: #a00;

		&:hover {
			text-decoration: none;
			text-shadow: 1px 1px 2px black;
		}
	}
	ul {
		list-style-type: none;
		display: flex;
		// background-color: gray;
		padding: 0;
		margin: 0;
		margin-top: 3rem;
	}
	div,
	ul,
	li {
		text-align: center;
	}
</style>
