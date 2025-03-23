<script>
	import { ki, kd } from '$lib/utils';
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
		integrity="sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="outer">
	<div class="container pt-4">
		<button><a href="../montyHall">Go back to the simulation</a></button>
		<h2 class="mt-8">The Monty Hall Paradox</h2>
		<p>
			The Monty Hall 'problem' (dilemma? paradox?) is a probability puzzle, originally posed in 1975
			by Steve Selvin in a letter to the American Statistician. The puzzle is based on the American
			television game show "Let's Make a Deal" and named after the show's original host, Monty Hall.
			It was popularized by Marilyn vos Savant in her "Ask Marilyn" column in 1990.
		</p>
		<blockquote>
			Suppose you're on a game show, and you're given the choice of three doors: Behind one door is
			a car; behind the others, goats. You pick a door, say No. 1, and the host, who knows what's
			behind the doors, opens another door, say No. 3, which has a goat. He then says to you, "Do
			you want to pick door No. 2?" Is it to your advantage to switch your choice?
		</blockquote>
		<p>
			Marilyn's answer was that you should switch doors, that in general you have a 2/3 chance of
			winning if you switch, and only a 1/3 chance if you stick with your original choice. This
			unleashed a torrent of critical responses (more than ten thousand in all, with about one
			thousand coming from PhDs) &ndash; and just a few defenses.
		</p>

		<p>
			I have included a few of the responses, taken from vos Savant's magnificent &ndash; and highly
			recommended &ndash; book "The Power of Logical Thinking,"
		</p>

		<blockquote>
			"Your answer to the question is in error. But if it any consolation, many of my academic
			colleagues have also been stumped by this problem." <br /><br />
			B. P., Ph.D., California Faculty Association
		</blockquote>
		<blockquote>
			"You blew it and you blew it big! Since you seem to have difficulty grasping the basic
			principle at work here, I'll explain. After the host reveals a goat, you now have a one-in-two
			chance of being correct. Whether you change your selection or not, the chances are the same.
			There is enough mathematical illiteracy in this country, and we don't need the world's highest
			IQ propagating more. Shame!" <br /> <br />
			S. S., Ph.D., California Faculty Association
		</blockquote>
		<p>
			At the time, around 1970, vos Savant had the highest recorded IQ in the world, with a score of
			228. Nowadays, she is third overall, and the most intelligent female.
		</p>
		<blockquote>
			"Dear Marilyn:<br /> <br />
			Since you seem to enjoy coming straight to the point, I'll do the same. In the following question
			and answer, you blew it! Let me explain. If one door is shown to be a loser, that information changes
			the probability of either remaining choice, neither of which has any reason to be more likely,
			to 1/2. As a professional mathematician, I'm very concerned with the general public's lack of mathematical
			skills. Please help by confessing your error and in future being more careful."<br /> <br />
			R. S., Ph.D., George Mason University
		</blockquote>
		<p>
			Wow! These Ph.D.s (all male, as it happens!) seem pretty sure of themselves. But they, and
			another thousand or so, Ph.D.s were wrong.
		</p>
		<h2>Justification</h2>
		<p>
			I have a degree in mathematics which is far below the giddy heights where doctoral academics
			reside. But I will try my best to explain.
		</p>
		<p>
			Consider first, the <strong>don't switch</strong> strategy. You have a 1/3 chance, or probability,
			of guessing correctly (with one-third probability) which door the car is behind. Since you don't
			switch, you will win if you guessed correctly. So, the probability of winning is 1/3. And the probability
			of losing is 2/3.
		</p>
		<p>
			Now, consider the <strong>switch</strong> strategy. You have a 1/3 chance of guessing
			correctly which door the car is behind. So, if you initially guessed correctly and then
			switched, you lose. With 1/3 probability. The probability that you will guess incorrectly is
			2/3. And, NOTE that whenever you guess incorrectly, you will <strong>win</strong> when you switch!
		</p>
		<p>
			<strong>Why do you always win when you switch after guessing incorrectly?</strong> Because then
			one of the two doors you didn't pick contains the car. And the other goat. The host will always
			reveal the goat, leaving the car behind the closed door you didn't initially choose. If you switch
			to the door that the host doesn't open, you win. (If this is confusing, just step through the simulation
			a few times, paying close attention to what happens when you switch!)
		</p>
		<p>
			When you see it, you'll wonder how so many of these brainiacs ended up with egg on their
			faces!
		</p>
		<button class="mt-8">
			<a href="../montyHall">Go back and have fun with the simulation!</a>
		</button>
		<h2 class="mt-8">Some Probability</h2>
		<p class="mt-8">
			There is a concept in probability theory called the <strong>expected value</strong> of a random
			variable. It is the sum of the probabilities of each possible outcome of the variable multiplied
			by the value of the outcome.
		</p>
		<p>
			If {@html ki(`X`)} represents a random variable (such as, in this case, the contestant winnings),
			then the expected value of {@html ki(`X`)} is
			{@html kd(`			
				E[X] = \\sum x_k\\cdot P_{x_k}
		`)}
			where {@html ki(`x_k`)} is the value of the {@html ki(`k`)}th outcome of each 'experiment'
			(winning, losing, heads, tails, ...) and {@html ki(`P_{x_k}`)} is the probability of that outcome
			(winning that prize, losing, getting a head, ...).
		</p>
		<p>
			<strong>Expected winnings with a 'DON'T SWITCH' strategy:</strong><br />
			Guessing the door with the car behind occurs with a one in three chance. By not switching, you
			win the car. You guess incorrectly with a two in three chance. By not switching, you win a goat.
			{@html kd(`
				\\begin{aligned}
					E[X] &= \\text{Car}\\cdot P_{\\text{guessing correctly}} \\\\
					&\\quad\\qquad + \\text{Goat}\\cdot P_{\\text{guessing incorrectly}} \\\\
					&= \\text{Car}\\cdot\\frac 13 + \\text{Goat}\\cdot\\frac 23 \\\\
					&= \\frac{\\text{Car}}{3} + \\frac{2\\cdot\\text{Goat}}{3}
				\\end{aligned}
			`)}
			You should expect (on average) to <strong>win the car one time in three</strong>.
		</p>
		<p>
			<strong>Expected winnings with a 'SWITCH' strategy:</strong><br />
			Guessing the door with the car behind still occurs with a one in three chance. But by switching,
			you do not win the car. However, if you guess incorrectly (which has a two in three chance) and
			switch, you win the car.
			{@html kd(`
				\\begin{aligned}
					E[X] &= \\text{Goat}\\cdot P_{\\text{guessing correctly}} \\\\
					&\\quad\\qquad + \\text{Car}\\cdot P_{\\text{guessing incorrectly}} \\\\
					&= \\text{Goat}\\cdot\\frac 13 + \\text{Car}\\cdot\\frac 23 \\\\
					&= \\frac{\\mathrm{2 \\cdot Car}}{3} + \\frac{\\text{Goat}}{3}
				\\end{aligned}
			`)}
			You should expect (on average) to <strong>win the car two times in three</strong>.
		</p>
	</div>
</div>

<style lang="scss">
	.outer {
		align-items: center;
		background-color: white;
		display: flex;
		flex-direction: column;
		font-size: clamp(0.875rem, 1.125vw, 1.5rem);
		height: auto;
		padding-bottom: 10rem;

		.container {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			height: 100%;
			max-width: min(40rem, 90%);
			padding-bottom: 10rem;

			h2 {
				font-size: 2em;
				margin-inline: auto;
				text-align: center;
			}

			p {
				margin-block: 1rem;
			}

			blockquote {
				background-color: var(--lightBeige-3);
				border-color: var(--terracotta);
				font-size: 1.25em;
				font-style: italic;
				margin-inline: auto;
				margin-block: 1rem;
				padding: 0.5rem;
				padding-left: 1rem;
			}

			h2 {
				color: var(--terracotta);
			}

			button {
				border: 0.2vw solid var(--mutedTeal-7);
				background-color: var(--lightBeige-3);
				box-shadow: var(--shadow-4);
				font-weight: 600;
				font-size: clamp(16px, 1.75vw, 24px);
				color: var(--mutedTeal-7);
				padding: 0.125rem;
				padding-inline: 1rem;

				text-align: right;

				&:hover {
					// text-shadow: 0.025vw 0.025vw 0.05vw purple;
					color: white;
					background-color: var(--mutedTeal-7);
					border-color: var(--mutedTeal-8);
				}

				& a:link,
				& a:visited {
					color: inherit;
					background-color: inherit;
					text-decoration: none;
					text-shadow: none;
				}
			}
		}
	}
</style>
