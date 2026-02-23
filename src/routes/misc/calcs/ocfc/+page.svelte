<!-- <script context="module">
	export const ssr = false
</script> -->

<script>
	// import { digits } from './digits.svelte.js'
	import HomeLink from '$lib/components/HomeLink.svelte'
	import OCFCHeader from './components/OCFCHeader.svelte'
	import Rectangular from './components/channels/Rectangular.svelte'
	import Triangular from './components/channels/Triangular.svelte'
	import Trapezoidal from './components/channels/Trapezoidal.svelte'
	import Circular from './components/channels/Circular.svelte'

	let channelType = $state('rectangular')
</script>

<div class="outer">
	<HomeLink color="var(--bg)" />
	<OCFCHeader bind:channelType />
	<div class="inner">
		<main>
			<div class:hide={channelType !== 'rectangular'}>
				<Rectangular />
			</div>
			<div class:hide={channelType !== 'triangular'}>
				<Triangular />
			</div>
			<div class:hide={channelType !== 'trapezoidal'}>
				<Trapezoidal />
			</div>
			<div class:hide={channelType !== 'circular'}>
				<Circular />
			</div>
		</main>
	</div>
</div>

<style lang="scss">
	.outer {
		background-color: var(--bg);
		// just for finer control of home link font-size
		font-size: 0.65em;
		min-height: 100vh;
		width: 100%;
	}
	// this sets the width of content and should be modified with media queries
	// width determined by the space taken up by inputs-row
	.inner {
		background-color: inherit;
		font-size: 1em;
		padding: 1em;
		padding: 0;
		padding-bottom: 2em;
		margin-inline: auto;
		width: fit-content;
	}

	// h1.title {
	// 	background-color: inherit;
	// 	color: #4682b4;
	// 	font-family: 'Shitake', cursive;
	// 	font-size: 10vw;
	// 	font-weight: bold;
	// 	letter-spacing: 0.375rem;
	// 	line-height: 1;
	// 	padding-inline: 2rem;
	// 	margin: 0;
	// 	margin-top: 1rem;
	// 	text-shadow: 2px 2px 2px black;
	// 	word-spacing: 0;
	// }

	// .card {
	// 	align-items: center;
	// 	background: white;
	// 	border: 4px solid #38688f;
	// 	border-radius: 10px;
	// 	display: flex;
	// 	flex-direction: column;
	// 	justify-content: center;
	// 	margin: 1rem;
	// 	padding: 1rem;

	// 	& h4 {
	// 		font-size: 5vw;
	// 		font-weight: bold;
	// 		margin-block-end: 1rem;
	// 	}

	// 	.radioGroup {
	// 		display: flex;
	// 		margin-block-end: 1em;
	// 		padding-block: 1em;

	// 		label.radio {
	// 			cursor: pointer;
	// 			margin-inline: 1rem;
	// 		}

	// 		input[type='radio'] {
	// 			appearance: none;
	// 			background-color: transparent;
	// 			border: 2px solid black;
	// 			border-radius: 50%;
	// 			height: 20px;
	// 			outline: none;
	// 			width: 20px;
	// 		}

	// 		input[type='radio']:checked {
	// 			background-color: #4682b4;
	// 		}
	// 	}

	// 	blockquote {
	// 		background-color: #e9f0f6;
	// 		border-left: none;
	// 		border: 1px solid #333;
	// 		border-radius: 5px;
	// 		margin-bottom: 1.5rem;
	// 		padding-inline: 1rem;
	// 		text-align: left;
	// 	}

	// 	section.form {
	// 		align-items: center;
	// 		column-gap: 0.25rem;
	// 		display: grid;
	// 		grid-template-columns: 3fr 1fr 0.125fr;
	// 		margin-block-end: 2rem;
	// 		row-gap: 0.5rem;

	// 		input[type='number'] {
	// 			background-color: #e9f0f6;
	// 			border: 1px solid #333;
	// 			width: 5rem;
	// 			padding-inline-start: 0.5rem;
	// 			padding-inline-end: 0.125rem;
	// 		}
	// 	}

	// 	.resultbox {
	// 		font-size: 1.25rem;
	// 		font-weight: bold;

	// 		.result {
	// 			color: white;
	// 			background: #4682b4;
	// 			border-radius: var(--radius-2);
	// 			padding-inline: 0.5rem;
	// 			padding-block: 0.25rem;
	// 		}
	// 	}

	// 	box-shadow: var(--shadow-6);
	// }

	// .form .label {
	// 	justify-self: end;
	// 	align-self: center;
	// }

	// .calc {
	// 	ul {
	// 		font-size: 1.125rem;
	// 		list-style-type: none;
	// 		margin-inline: auto;
	// 		padding-inline-start: 0;
	// 		text-align: left;
	// 		width: 95%;

	// 		li {
	// 			margin-block: 1rem;
	// 		}
	// 	}
	// }

	// }

	// input[type='number']::-webkit-outer-spin-button,
	// input[type='number']::-webkit-inner-spin-button {
	// 	-webkit-appearance: none;
	// 	display: none;

	// // @media (max-width: 600px) {
	// // 	.outer {
	// // 		padding: 0.5rem;
	// // 		padding-inline: 0;
	// // 	}
	// // 	.inner {
	// // 		padding: var(--size-1);
	// // 	}
	// // 	.inner h1 {
	// // 		font-family: 'Shitake';
	// // 		font-size: var(--font-size-5);
	// // 	}

	// // 	.card {
	// // 		border-width: var(--border-size-3);
	// // 		font-size: 1.25rem;
	// // 		margin-inline: auto;
	// // 		margin-block-start: 1rem;
	// // 		padding-block: 1rem;
	// // 		min-width: 0;
	// // 		padding-inline: 0.5rem;
	// // 	}
	// // 	.calc {
	// // 		width: 85%;
	// // 		margin-inline: auto;
	// // 	}
	// // 	/* .resultbox {
	// // 		font-size: 120%;
	// // 	} */
	// // 	.radioGroup {
	// // 		padding-block-start: 0;
	// // 	}

	// // 	.result {
	// // 		font-size: 1.25rem;
	// // 		padding: 0.5rem;
	// // 		padding-block: 0.25rem;
	// // 	}
	// // }

	// label.radio,
	// h4 {
	// 	font-size: 1.125rem;
	// 	font-style: normal;
	// }
</style>
