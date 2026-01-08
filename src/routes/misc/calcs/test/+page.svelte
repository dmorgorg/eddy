<script>
	// @ts-nocheck

	import { tick } from 'svelte';

	let list = ['a', 'b', 'c', 'd', 'e', 'f'];
	let element;

	// onMount(() => scrollToBottom(element));

	const scrollToBottom = async (node) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	async function addName() {
		list.push('Name');
		list = list;
		await tick();
		scrollToBottom(element);
	}
</script>

<div>
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium similique optio quisquam,
	iure asperiores beatae ratione blanditiis amet delectus numquam aliquam sequi accusamus officiis
	sed, aspernatur deleniti, explicabo quasi saepe.lorem20Lorem ipsum dolor sit amet consectetur
	adipisicing elit. Accusantium similique optio quisquam, iure asperiores beatae ratione blanditiis
	amet delectus numquam aliquam sequi accusamus officiis sed, aspernatur deleniti, explicabo quasi
	saepe.lorem20Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium similique optio
	quisquam, iure asperiores beatae ratione blanditiis amet delectus numquam aliquam sequi accusamus
	officiis sed, aspernatur deleniti, explicabo quasi saepe.lorem20Lorem ipsum dolor sit amet
	consectetur adipisicing elit. Accusantium similique optio quisquam, iure asperiores beatae ratione
	blanditiis amet delectus numquam aliquam sequi accusamus officiis sed, aspernatur deleniti,
	explicabo quasi saepe.lorem20Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
	similique optio quisquam, iure asper
</div>

<div bind:this={element} style="height:250px;overflow:auto;">
	{#each list as name}
		<h1>Hello {name}!</h1>
	{/each}
</div>

<button on:click={addName}>Add name</button>
