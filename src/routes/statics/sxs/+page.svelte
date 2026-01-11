<script>
	import Header from '$lib/components/Header.svelte';
</script>

<Header theme="#a00" />

<div class="container">
	<h3>Step-through worked examples</h3>
	<div>
		Here you can find a collection of worked examples for Statics, formatted as .pdf presentations,
		for download. These presentations are designed to be viewed in a standalone .pdf reader (like
		Sumatra or Adobe Reader or ...) on a desktop, stepping through the slides, rather than viewed
		continuously scrolling through in a browser or on a smaller device.
	</div>
	<div>
		Pages on these documents contain a lot of information and the font size is necessarily small.
		They more suited to personal use than to projection onto classroom screens.
	</div>

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
		<br />
		<li>
			<a href="/statics/sxs/09CFSxS.pdf" download>09 Complex Frames (Download)</a>
			<a href="/statics/sxs/09CFSxS.pdf">(View Online)</a> (Added 27th December, 2025)
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
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-inline: auto;
		width: 40rem;
	}
	h3 {
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
