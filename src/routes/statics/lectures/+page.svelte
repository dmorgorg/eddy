<script>
	import Header from '$lib/components/Header.svelte';
</script>

<Header theme="#a00" />

<div class="container">
	<h3>Lectures and Handouts</h3>
	<div>
		Here you can find a collection of 'refreshed' versions of my old Statics presentations,
		formatted as .pdf presentations. There are also associated handouts for each lecture topic.
	</div>
	<div>Check back every week or two, as more will be posted.</div>

	<ul>
		<li>
			<a href="/statics/lectures/01MathReview.pdf">01 Math Review </a>
			<a href="/statics/lectures/01MathReview.pdf" download>(Download)</a>&nbsp;
			<a href="/statics/handouts/01MathReviewStudentHandout.pdf">Handout</a>
			<a href="/statics/handouts/01MathReviewStudentHandout.pdf" download>(Download)</a> &nbsp;
			<span class="eighty"> <br />(Uploaded 19th August, 2025) </span>
		</li>
		<br />
		<li>
			<a href="/statics/lectures/02ForceVectors.pdf">02 Force Vectors </a>
			<a href="/statics/lectures/02ForceVectors.pdf" download>(Download)</a>&nbsp;
			<a href="/statics/handouts/02ForceVectorsStudentHandout.pdf">Handout</a>
			<a href="/statics/handouts/02ForceVectorsStudentHandout.pdf" download>(Download)</a>
			<span class="eighty"> <br />(Uploaded 1st September, 2025) </span>
		</li>
		<br />
		<li>
			<a href="/statics/lectures/03EquiConcurrent.pdf">
				03 Equilibrium of a Particle / Concurrent Forces
			</a>
			<a href="/statics/lectures/03EquiConcurrent.pdf" download>(Download)</a>&nbsp;
			<a href="/statics/handouts/03EquiConcStudentHandout.pdf">Handout</a>
			<a href="/statics/handouts/03EquiConcStudentHandout.pdf" download>(Download)</a>
			<span class="eighty"> <br />(Uploaded 14th September, 2025) </span>
		</li>
		<br />
		<li>
			<a href="/statics/lectures/04Centroids.pdf">04 Centroids </a>
			<a href="/statics/lectures/04Centroids.pdf" download>(Download)</a>&nbsp;
			<a href="/statics/handouts/04CentroidsStudentHandout.pdf">Handout</a>
			<a href="/statics/handouts/04CentroidsStudentHandout.pdf" download>(Download)</a>
			<span class="eighty"> <br />(Uploaded 17th September, 2025) </span>
		</li>
		<br />
		<li>
			<a href="/statics/lectures/05Moments.pdf">05 Moments </a>
			<a href="/statics/lectures/05Moments.pdf" download>(Download)</a>&nbsp;
			<a href="/statics/handouts/05MomentsStudentHandout.pdf">Handout</a>
			<a href="/statics/handouts/05MomentsStudentHandout.pdf" download>(Download)</a>
			<span class="eighty"> <br />(Uploaded 23rd September, 2025) </span>
		</li>
		<br />
		<li>
			<a href="/statics/lectures/06ERB.pdf">06 Equilibrium of Rigid Bodies </a>
			<a href="/statics/lectures/06ERB.pdf" download>(Download)</a>&nbsp;
			<a href="/statics/handouts/06ERBStudentHandout.pdf">Handout</a>
			<a href="/statics/handouts/06ERBStudentHandout.pdf" download>(Download)</a>
			<span class="eighty"> <br />(Uploaded 6th October, 2025) </span>
		</li>

		<br />
		<li>
			<a href="/statics/lectures/07MoJ.pdf">07 Method of Joints </a>
			<a href="/statics/lectures/07MoJ.pdf" download>(Download)</a>&nbsp;
			<a href="/statics/handouts/07MoJStudentHandout.pdf">Handout</a>
			<a href="/statics/handouts/07MoJStudentHandout.pdf" download>(Download)</a>
			<span class="eighty"> <br />(Uploaded 16th October, 2025) </span>
		</li>
		<br />
		<li>
			<a href="/statics/lectures/08MoS.pdf">08 Method of Sections </a>
			<a href="/statics/lectures/08MoS.pdf" download>(Download)</a>&nbsp;
			<!-- <a href="/statics/handouts/07MoJStudentHandout.pdf">Handout</a>
			<a href="/statics/handouts/07MoJStudentHandout.pdf" download>(Download)</a> -->
			<span class="eighty"> <br />(Uploaded 26th October, 2025) </span>
		</li>
		<br />
		<li>
			<a href="/statics/lectures/09CF.pdf">09 Complex Frames </a>
			<a href="/statics/lectures/09CF.pdf" download>(Download)</a>&nbsp;
			<!-- <a href="/statics/handouts/07MoJStudentHandout.pdf">Handout</a>
			<a href="/statics/handouts/07MoJStudentHandout.pdf" download>(Download)</a> -->
			<span class="eighty"> <br />(Uploaded 20th November, 2025) </span>
		</li>
	</ul>

	<div class="feedback eighty0">
		Please send feedback and notification of typos or errors, etc., to
		<a href="mailto:bugs.eduk8r@gmail.com?subject=Lectures and Handouts">bugs.eduk8r@gmail.com</a>
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
		width: 100%;

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
