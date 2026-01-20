<script>
	// @ts-nocheck
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let base = $state(4);
	let depth = $state(3);

	// Tweened values using Tween.of() to track reactive state
	const tweenedBase = Tween.of(() => base, {
		duration: 400,
		easing: cubicOut
	});

	const tweenedDepth = Tween.of(() => depth, {
		duration: 400,
		easing: cubicOut
	});

	// Canvas dimensions
	const canvasWidth = 400;
	const padding = 40;
	const wallExtension = 20; // How much the walls extend above water level
	const maxScale = 50; // Cap the scale
	const maxAspectRatio = 10; // Max base:depth ratio for visual display
	const minAspectRatio = 0.5; // Min base:depth ratio (depth:base max of 2)

	// Get clamped visual dimensions based on aspect ratio limits
	function getVisualDimensions(b, d) {
		const actualRatio = b / d;
		let visualBase = b;
		let visualDepth = d;

		if (actualRatio > maxAspectRatio) {
			// Too wide - clamp to max aspect ratio
			visualDepth = b / maxAspectRatio;
		} else if (actualRatio < minAspectRatio) {
			// Too tall - clamp to min aspect ratio
			visualBase = d * minAspectRatio;
		}

		return { visualBase, visualDepth };
	}

	// Calculate canvas height based on channel proportions
	const canvasHeight = $derived(() => {
		const b = tweenedBase.current;
		const d = tweenedDepth.current;
		const { visualBase, visualDepth } = getVisualDimensions(b, d);

		// Calculate the scale based on width constraint
		const maxChannelWidth = canvasWidth - 2 * padding;
		const scaleX = maxChannelWidth / Math.max(visualBase, 0.1);
		const scale = Math.min(scaleX, maxScale);

		// Calculate the drawn height of the channel
		const drawHeight = visualDepth * scale;

		// Total height: padding (top for wall extension) + wall extension + channel + padding (bottom for label)
		return Math.max(drawHeight + wallExtension + 2 * padding + 10, 120); // min height of 120
	});

	// Draw the rectangular channel
	function drawChannel(canvasEl, b, d, height) {
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		// Get clamped visual dimensions
		const { visualBase, visualDepth } = getVisualDimensions(b, d);

		// Clear canvas
		ctx.clearRect(0, 0, canvasWidth, height);

		// Calculate scale based on width constraint only
		const maxChannelWidth = canvasWidth - 2 * padding;
		const scaleX = maxChannelWidth / Math.max(visualBase, 0.1);
		const scale = Math.min(scaleX, maxScale);

		const drawWidth = visualBase * scale;
		const drawHeight = visualDepth * scale;

		// Center the channel horizontally, position at bottom with padding
		const startX = (canvasWidth - drawWidth) / 2;
		const startY = height - padding;

		// Draw water fillrgba(100, 149, 237, 0.05)
		ctx.fillStyle = '#008d8a';
		ctx.beginPath();
		ctx.rect(startX, startY - drawHeight, drawWidth, drawHeight);
		ctx.fill();

		// Draw channel outline (U-shape)
		ctx.strokeStyle = '#333';
		ctx.lineWidth = 3;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		// Left wall
		ctx.beginPath();
		ctx.moveTo(startX, startY - drawHeight - wallExtension);
		ctx.lineTo(startX, startY);

		// Bottom
		ctx.lineTo(startX + drawWidth, startY);

		// Right wall
		ctx.lineTo(startX + drawWidth, startY - drawHeight - wallExtension);
		ctx.stroke();

		// Draw dimension labels
		ctx.fillStyle = '#333';
		ctx.font = '14px sans-serif';
		ctx.textAlign = 'center';

		// Base dimension (bottom)
		ctx.fillText(`b = ${b.toFixed(2)}`, startX + drawWidth / 2, startY + 25);

		// Depth dimension (side)
		ctx.save();
		ctx.translate(startX - 20, startY - drawHeight / 2);
		ctx.rotate(-Math.PI / 2);
		ctx.fillText(`y = ${d.toFixed(2)}`, 0, 0);
		ctx.restore();

		// Draw water surface line (dashed)
		ctx.strokeStyle = '#006666';
		ctx.lineWidth = 2;
		// ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(startX, startY - drawHeight);
		ctx.lineTo(startX + drawWidth, startY - drawHeight);
		ctx.stroke();
		// ctx.setLineDash([]);

		// Draw vertical depth arrow inside the channel
		const arrowX = startX + drawWidth / 2; // Center of channel
		const arrowTop = startY - drawHeight;
		const arrowBottom = startY;
		const arrowHeadSize = 8;

		ctx.strokeStyle = '#fff';
		ctx.fillStyle = '#fff';
		ctx.lineWidth = 2;

		// Vertical line
		ctx.beginPath();
		ctx.moveTo(arrowX, arrowBottom - arrowHeadSize);
		ctx.lineTo(arrowX, arrowTop + arrowHeadSize);
		ctx.stroke();

		// Bottom arrowhead (pointing down)
		ctx.beginPath();
		ctx.moveTo(arrowX, arrowBottom);
		ctx.lineTo(arrowX - arrowHeadSize / 2, arrowBottom - arrowHeadSize);
		ctx.lineTo(arrowX + arrowHeadSize / 2, arrowBottom - arrowHeadSize);
		ctx.closePath();
		ctx.fill();

		// Top arrowhead (pointing up)
		ctx.beginPath();
		ctx.moveTo(arrowX, arrowTop);
		ctx.lineTo(arrowX - arrowHeadSize / 2, arrowTop + arrowHeadSize);
		ctx.lineTo(arrowX + arrowHeadSize / 2, arrowTop + arrowHeadSize);
		ctx.closePath();
		ctx.fill();
	}

	let canvasEl = $state(null);

	function bindCanvas(node) {
		canvasEl = node;
		return {
			destroy() {
				canvasEl = null;
			}
		};
	}

	// Redraw when tweened values change
	$effect(() => {
		if (canvasEl) {
			const height = canvasHeight();
			canvasEl.height = height;
			drawChannel(canvasEl, tweenedBase.current, tweenedDepth.current, height);
		}
	});
</script>

<div class="channel-container">
	<div class="inputs">
		<label>
			Base (b):
			<input type="number" bind:value={base} min="0.1" step="0.1" />
		</label>
		<label>
			Depth (y):
			<input type="number" bind:value={depth} min="0.1" step="0.1" />
		</label>
	</div>

	<canvas use:bindCanvas width={canvasWidth} height={canvasHeight()}> </canvas>

	<!-- <div class="info">
		<p>Area: {(base * depth).toFixed(2)} m²</p>
		<p>Wetted Perimeter: {(base + 2 * depth).toFixed(2)} m</p>
		<p>Hydraulic Radius: {((base * depth) / (base + 2 * depth)).toFixed(3)} m</p>
	</div> -->
</div>

<style>
	.channel-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		/* background: yellow; */
	}

	.inputs {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-weight: 500;
	}

	input[type='number'] {
		width: 100px;
		padding: 0.5rem;
		border: 2px solid var(--primaryColor, #008d8a);
		border-radius: 4px;
		font-size: 1rem;
	}

	canvas {
		border: none;
		background: inherit;
	}

	/* .info {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		justify-content: center;
		font-size: 0.9rem;
	}

	.info p {
		margin: 0;
		padding: 0.5rem 1rem;
		background: #f0f0f0;
		border-radius: 4px;
	} */
</style>
