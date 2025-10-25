<script>
	import Header from '$lib/components/Header.svelte';
</script>

<Header theme="#a00" />

<div class="container">
	<h3>Step-through worked examples</h3>
	<div>
		Here you can find a collection of worked 'step-through' examples for Statics, formatted as .pdf
		presentations, for download. They are better stepped-through in a standalone pdf reader (like
		Sumatra or Adobe Reader or ...) than viewed continuously scrolling through in a browser.
	</div>
	<div>Check back every now and again, as more will be posted.</div>

	<ul>
		<li>
			<a href="/statics/sxs/07MoJSxS.pdf" download>07 Method of Joints (Download)</a>
			<a href="/statics/sxs/07MoJSxS.pdf">(View Online)</a> (Added 11th August, 2025)
		</li>
		<br />
		<li>
			<a href="/statics/sxs/08MoSSxS.pdf" download>08 Method of Sections (Download)</a>
			<a href="/statics/sxs/08MoSSxS.pdf">(View Online)</a> (Added 24th October, 2025)
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
		// display: flex;
		// background-color: gray;
		padding: 0;
		margin: 0;
		margin-top: 3rem;
		width: 100%;
	}
	div,
	ul,
	li {
		display: inline;
		text-align: center;
		padding-inline: 0;
	}
</style>
