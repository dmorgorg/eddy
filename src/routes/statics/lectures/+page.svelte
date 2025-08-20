<script>
	import Header from '$lib/components/Header.svelte';
</script>

<Header theme="#a00" />

<div class="container">
	<h3>Lectures and Handouts</h3>
	<div>
		Here you can find a collection of 'refreshed' versions of old Statics presentations, formatted
		as .pdf presentations. There are also associated handouts for each lecture topic.
	</div>
	<div>Check back every week or two, as more will be posted.</div>

	<ul>
		<li>
			<a href="/statics/lectures/01MathReview.pdf">01 Math Review </a>
			<a href="/statics/lectures/01MathReview.pdf" download>(Download)</a>
			<a href="/statics/handouts/01MathReviewStudentHandout.pdf">(Handout)</a> &nbsp;
			<span class="eighty"> (Uploaded 19th August, 2025) </span>
		</li>
	</ul>

	<div class="feedback eighty0">
		Please send feedback and notification of typos or errors, etc., to
		<a href="mailto:bugs.eduk8r@gmail.com?subject=Lectures and Handouts">bugs.eduk8r@gmail.com</a>
	</div>
</div>

<!-- <div class="feedback">test</div> -->

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
		width: 100%;

		&:hover {
			text-decoration: none;
			text-shadow: 1px 1px 2px black;
		}
	}
	ul {
		list-style-type: none;
		// display: flex;
		// background-color: gray;
		// justify-content: center;
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
