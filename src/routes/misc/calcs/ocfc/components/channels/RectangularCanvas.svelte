<script>
	// @ts-nocheck
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import { ki } from '$lib/utilities';

	/** @type {{ base: number, depth: number, yOrQ?: 'y' | 'Q', baseLabelPos?: {x: number, y: number}, depthLabelPos?: {x: number, y: number}, children?: import('svelte').Snippet }} */
	let {
		base = $bindable(),
		depth = $bindable(),
		yOrQ = 'y',
		baseLabelPos = $bindable({ x: 0, y: 0 }),
		depthLabelPos = $bindable({ x: 0, y: 0 }),
		children
	} = $props();

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
	const maxCanvasHeight = 300; // Maximum canvas height
	const minChannelSize = 40; // Minimum channel width and depth in pixels
	const padding = 30;
	const wallExtension = 20; // How much the walls extend above water level
	const maxAspectRatio = 6; // Max ratio before breaking aspect ratio (b > 6y or y > 6b)

	// Get clamped visual dimensions based on aspect ratio limits
	function getVisualDimensions(b, d) {
		const ratio = b / d;
		let visualBase = b;
		let visualDepth = d;
		let aspectRatioMaintained = true;

		if (ratio > maxAspectRatio) {
			// Too wide (b > 6y) - clamp visual depth
			visualDepth = b / maxAspectRatio;
			aspectRatioMaintained = false;
		} else if (ratio < 1 / maxAspectRatio) {
			// Too tall (y > 6b) - clamp visual base
			visualBase = d / maxAspectRatio;
			aspectRatioMaintained = false;
		}

		return { visualBase, visualDepth, aspectRatioMaintained };
	}

	// Calculate scale that fits within canvas constraints
	function getScale(visualBase, visualDepth, aspectRatioMaintained) {
		const maxChannelWidth = canvasWidth - 2 * padding;
		const maxChannelHeight = maxCanvasHeight - wallExtension - 2 * padding - 10;

		const scaleX = maxChannelWidth / Math.max(visualBase, 0.1);
		const scaleY = maxChannelHeight / Math.max(visualDepth, 0.1);

		let scale = Math.min(scaleX, scaleY);
		// Scale down to 80% when maintaining aspect ratio
		if (aspectRatioMaintained) {
			scale *= 0.8;
		}
		return scale;
	}

	// Calculate canvas height based on channel proportions
	const canvasHeight = $derived(() => {
		const b = tweenedBase.current;
		const d = tweenedDepth.current;

		const { visualBase, visualDepth, aspectRatioMaintained } = getVisualDimensions(b, d);
		const scale = getScale(visualBase, visualDepth, aspectRatioMaintained);

		// Calculate drawn dimensions with minimum size constraints
		const drawHeight = Math.max(visualDepth * scale, minChannelSize);

		// Total height: padding (top for wall extension) + wall extension + channel + padding (bottom for label)
		const height = drawHeight + wallExtension + 2 * padding + 10;
		return Math.max(Math.min(height, maxCanvasHeight), 120); // clamp between 120 and maxCanvasHeight
	});

	// Draw the rectangular channel
	function drawChannel(canvasEl, b, d, height, showDepthArrow) {
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		// Clear canvas
		// ctx.clearRect(0, 0, canvasWidth, height);

		// Get visual dimensions (clamped by aspect ratio)
		const { visualBase, visualDepth, aspectRatioMaintained } = getVisualDimensions(b, d);
		const scale = getScale(visualBase, visualDepth, aspectRatioMaintained);

		// Calculate drawn dimensions, enforcing minimum sizes
		const drawWidth = Math.max(visualBase * scale, minChannelSize);
		const drawHeight = Math.max(visualDepth * scale, minChannelSize);

		// Center the channel horizontally, position at bottom with padding
		const startX = (canvasWidth - drawWidth) / 2;
		const startY = height - 1.5 * padding;

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

		// Calculate label positions for HTML overlay
		const labelPositions = {
			baseLabel: { x: startX + drawWidth / 2, y: startY + 10 },
			depthLabel: { x: startX + drawWidth / 2, y: startY - drawHeight / 2 }
		};

		// Draw horizontal base arrow below the channel
		const baseArrowY = startY + 26; // Centered on b and m text
		const arrowHeadSize = 8;

		ctx.strokeStyle = '#333';
		ctx.fillStyle = '#333';
		ctx.lineWidth = 2;

		// Horizontal line (left segment)
		ctx.beginPath();
		ctx.moveTo(startX, baseArrowY);
		ctx.lineTo(startX + drawWidth / 2 - 50, baseArrowY); // Stop before label
		ctx.stroke();

		// Horizontal line (right segment)
		ctx.beginPath();
		ctx.moveTo(startX + drawWidth / 2 + 50, baseArrowY); // Start after label
		ctx.lineTo(startX + drawWidth, baseArrowY);
		ctx.stroke();

		// Left arrowhead (pointing left)
		ctx.beginPath();
		ctx.moveTo(startX, baseArrowY);
		ctx.lineTo(startX + arrowHeadSize, baseArrowY - arrowHeadSize / 2);
		ctx.lineTo(startX + arrowHeadSize, baseArrowY + arrowHeadSize / 2);
		ctx.closePath();
		ctx.fill();

		// Right arrowhead (pointing right)
		ctx.beginPath();
		ctx.moveTo(startX + drawWidth, baseArrowY);
		ctx.lineTo(startX + drawWidth - arrowHeadSize, baseArrowY - arrowHeadSize / 2);
		ctx.lineTo(startX + drawWidth - arrowHeadSize, baseArrowY + arrowHeadSize / 2);
		ctx.closePath();
		ctx.fill();

		// Draw water surface line (dashed)
		ctx.strokeStyle = '#006666';
		ctx.lineWidth = 2;
		// ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(startX, startY - drawHeight);
		ctx.lineTo(startX + drawWidth, startY - drawHeight);
		ctx.stroke();
		// ctx.setLineDash([]);

		// Draw vertical depth arrow inside the channel (only when solving for y)
		if (showDepthArrow) {
			const arrowX = startX + drawWidth / 2; // Center of channel
			const arrowTop = startY - drawHeight;
			const arrowBottom = startY;
			const arrowHeadSize = 8;

			ctx.strokeStyle = '#000';
			ctx.fillStyle = '#000';
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

		return labelPositions;
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
			const showDepthArrow = yOrQ === 'y';
			const positions = drawChannel(
				canvasEl,
				tweenedBase.current,
				tweenedDepth.current,
				height,
				showDepthArrow
			);
			if (positions) {
				baseLabelPos = positions.baseLabel;
				depthLabelPos = positions.depthLabel;
			}
		}
	});
</script>

<div class="channel-container">
	<div class="canvas-wrapper">
		<canvas use:bindCanvas width={canvasWidth} height={canvasHeight}> </canvas>
		{#if children}{@render children()}{/if}
	</div>
</div>

<style>
	.channel-container {
		/* display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem; */
		padding: 1rem;
		padding-block: 0;
		/* border: 2px solid black; */
	}

	.canvas-wrapper {
		position: relative;
		/* display: inline-block; */
		/* background-color: yellow; */
		/* border: 1px solid red; */
		margin-bottom: 0.5em;
		/* margin-top: -3em; */
	}

	canvas {
		border: none;
		background: inherit;
		/* border: 1px solid blue; */
		/* margin-top: -1em; */
	}
</style>
