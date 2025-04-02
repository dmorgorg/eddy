<script>
	import { namedColors, colorGroups } from './functions';
	import { hexToRgb, hexToHsl } from './functions';

	// @ts-nocheck
	let selectionMode = $state('by-name'); // 'name' or 'group'
	let selectedColor = $state('DarkSeaGreen');
	let hexValue = $state('#abcd');
	// let hexValue = $state('#8FBC8F');
	let rgbValue = $state('rgb(143 188 143)');
	let hslValue = $state('hsl(120 25% 65%)');
	let brightness = $derived(getBrightness(hexValue));
	let intensity = $derived(getIntensity(hexValue));

	function updateFromNamedColor() {
		if (namedColors[selectedColor]) {
			hexValue = namedColors[selectedColor];
			rgbValue = hexToRgb(hexValue);
			hslValue = hexToHsl(hexValue);
		}
	}
	function updateFromHex() {
		// Ensure the hex value has a # prefix
		if (!hexValue.startsWith('#')) {
			hexValue = '#' + hexValue;
		}

		// Regular expression to validate hex color format
		const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

		if (!hexRegex.test(hexValue)) {
			console.log(hexValue);
			return; // Exit function if format is invalid
		}

		// Create a normalized version for calculations
		let normalizedHex = hexValue;

		// If it's a 3-digit hex, expand it to 6-digit for calculations
		if (hexValue.length === 4) {
			// #RGB format
			const r = hexValue[1];
			const g = hexValue[2];
			const b = hexValue[3];
			normalizedHex = `#${r}${r}${g}${g}${b}${b}`;

			// Update the hex input with a delay
			setTimeout(() => {
				hexValue = normalizedHex;
			}, 1000);
		}

		// Check if the hex color matches a named color
		let colorName = Object.keys(namedColors).find(
			(key) => namedColors[key].toUpperCase() === normalizedHex.toUpperCase()
		);

		if (colorName) {
			selectedColor = colorName;
		} else {
			selectedColor = 'not a named color';
		}

		// Update RGB and HSL values using the normalized hex
		rgbValue = hexToRgb(normalizedHex);
		hslValue = hexToHsl(normalizedHex);
	}
	function updateFromRgb() {
		console.log('updateFromRgb', rgbValue);
	}
	function updateFromHsl() {
		console.log('updateFromHsl', hslValue);
	}

	/**
	 * Calculate the brightness of a color.
	 * @param {string} hex - The hex value of the color.
	 * @returns {number} - The brightness of the color, ranging from 0 to 255.
	 */
	function getBrightness(hex) {
		let bigint = parseInt(hex.slice(1), 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;
		return Math.round((r * 299 + g * 587 + b * 114) / 1000);
	}
	/**
	 * Calculate the intensity of a color.
	 * @param {string} hex - The hex value of the color.
	 * @returns {number} - The intensity of the color, ranging from 0 to 255.
	 */
	function getIntensity(hex) {
		let bigint = parseInt(hex.slice(1), 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;
		return Math.round((r + g + b) / 3);
	}
</script>

<div class="outer" style:background-color={hexValue === '#FFFFFF' ? '#eee' : 'white'}>
	<!-- Hex: {hexValue} Brightness: {getBrightness(hexValue)} Intensity: {intensity} -->

	<div class="container">
		<div class="separator"></div>
		<header style:background-color={hexValue} style:color={brightness < 100 ? 'white' : 'black'}>
			<h1>Color Code Converter</h1>
		</header>
		<div class="named">
			<div class="radio-group">
				<div>
					<input
						type="radio"
						bind:group={selectionMode}
						value="by-name"
						id="radio1"
						style:background-color={selectionMode === 'by-name' && hexValue !== '#ffffff'
							? hexValue
							: selectionMode === 'by-name'
								? 'Silver'
								: 'transparent'}
					/>
					<label for="radio1"> Select Color by Name </label>
				</div>
				<div>
					<input
						type="radio"
						bind:group={selectionMode}
						value="by-group"
						id="radio2"
						style:background-color={selectionMode === 'by-group' && hexValue !== '#ffffff'
							? hexValue
							: selectionMode === 'by-group'
								? 'Silver'
								: 'transparent'}
					/>
					<label for="radio2"> Select Color from Grouping </label>
				</div>
			</div>

			<!-- <div class="controls"> -->
			{#if selectionMode === 'by-name'}
				<select
					bind:value={selectedColor}
					onchange={updateFromNamedColor}
					class="color-select"
					style:background-color={hexValue}
					style:color={getBrightness(hexValue) < 100 ? 'white' : 'black'}
				>
					<!-- {console.log(selectedColor)} -->
					{#if selectedColor == 'not a named color'}
						<!-- {console.log('in if')} -->
						<option value={selectedColor}>Not a named color</option>
						<!-- {console.log('in iffy')} -->
					{:else}
						<!-- {console.log('in else')} -->
						<option value="">Select Color</option>
					{/if}
					{#each Object.keys(namedColors) as color}
						<option value={color} style="background-color: {color}">{color}</option>
					{/each}
				</select>
			{:else}
				<select
					bind:value={selectedColor}
					onchange={updateFromNamedColor}
					class="color-select"
					style:background-color={hexValue}
					style:color={getBrightness(hexValue) < 100 ? 'white' : 'black'}
				>
					{#if selectedColor == 'not a named color'}
						<option value={selectedColor}>Not a named color</option>
					{:else}
						<option value="">Select Color</option>
					{/if}
					{#each Object.keys(colorGroups) as group}
						<optgroup label={group}>
							{#each colorGroups[group] as color}
								<option value={color} style="background-color: {namedColors[color]};"
									>{color}</option
								>
							{/each}
						</optgroup>
					{/each}
				</select>
			{/if}
		</div>
		<div class="text-inputs">
			<div>
				Hex:
				<input
					type="text"
					bind:value={hexValue}
					oninput={updateFromHex}
					class="input-box hex-input"
					spellcheck="false"
					style:background-color={hexValue}
					style:color={getBrightness(hexValue) < 100 ? 'white' : 'black'}
				/>
			</div>
			<div>
				RGB:
				<input
					type="text"
					bind:value={rgbValue}
					oninput={updateFromRgb}
					class="input-box hex-input"
					spellcheck="false"
					style:background-color={hexValue}
					style:color={getBrightness(hexValue) < 100 ? 'white' : 'black'}
				/>
			</div>
			<div>
				HSL:
				<input
					type="text"
					bind:value={hslValue}
					oninput={updateFromHsl}
					class="input-box hex-input"
					spellcheck="false"
					style:background-color={hexValue}
					style:color={getBrightness(hexValue) < 100 ? 'white' : 'black'}
				/>
			</div>
		</div>

		<div class="separator"></div>

		<header style:background-color={hexValue} style:color={brightness < 100 ? 'white' : 'black'}>
			<h1>Color Shader</h1>
		</header>

		<div class="separator"></div>

		<header style:background-color={hexValue} style:color={brightness < 100 ? 'white' : 'black'}>
			<h1>Color Blender</h1>
		</header>

		<div class="separator"></div>
		{selectedColor}: {intensity}
	</div>
</div>

<!-- </div> -->

<style lang="scss">
	.outer {
		background-color: white;
		background-color: #cccaaa;
		width: 100%;
		min-height: 100vh;
		overflow-y: auto;
		padding: 1rem;

		.container {
			align-items: center;
			background-color: transparent;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			margin-inline: auto;
			// padding: 1rem;
			width: 40rem;
			// border: 1px solid black;

			header {
				// border: 1px solid black;
				border-radius: 0.25rem;
				box-shadow: var(--shadow-4);
				color: black;
				display: block;
				font-weight: bold;
				// margin-block-end: 1rem;
				// margin-inline: auto;
				padding: 0.5rem;
				text-align: center;
				transition:
					background-color 0.3s,
					color 0.3s;
				width: 100%;
				// border: 2px solid black;

				h1 {
					font-family: 'AlkesRgIt';
					font-size: 2em;
					margin-inline: auto;
				}
			}

			.separator {
				// border: 1px solid black;
				border-radius: 0.25rem;
				background-color: silver;
				width: 100%;
				height: 1rem;
			}

			.named {
				display: flex;
				justify-content: space-between;
				align-items: center;
				// gap: 1rem;
				// border: 1px solid black;
				width: 100%;

				select {
					border: none;
					border-radius: 4px;
					box-shadow: var(--shadow-4);
					outline: none;
					font-family: inherit;
					font-size: inherit;
					cursor: inherit;
					line-height: inherit;
					padding: 0.5rem;
					transition:
						background-color 0.3s,
						color 0.3s;
					width: 14rem;
				}
			}

			.radio-group {
				display: flex;
				justify-content: space-between;
				position: relative;

				input[type='radio'] {
					appearance: none;
					background-color: transparent;
					border: 2px solid black;
					border: 1px solid black;
					border-radius: 50%;
					position: absolute;
					top: 0.2rem;
					transition:
						background-color 0.3s,
						color 0.3s;
					height: 1.4rem;
					width: 1.4rem;
					&:checked {
						border: 2px solid black;
						box-shadow: var(--shadow-6);
					}
				}

				label {
					border-radius: 0.25rem;
					font-size: 90%;
					margin-left: 1.75rem;
					padding-right: 1rem;
					text-align: center;
					&:checked {
						color: var(--light-blue);
					}
				}
			}

			.text-inputs {
				display: flex;
				// gap: 2rem;
				justify-content: space-between;
				align-items: center;
				// border: 1px solid black;
				width: 100%;

				div {
					display: flex;
					align-items: center;
					gap: 0.25rem;
					flex-direction: column;
				}

				input[type='text'] {
					border: none;
					border-radius: 4px;
					box-shadow: var(--shadow-4);
					outline: none;
					font-family: inherit;
					font-size: inherit;
					cursor: inherit;
					line-height: inherit;
					padding: 0.5rem;
					transition:
						background-color 0.3s,
						color 0.3s;
					width: 10rem;
				}
			}
		}
	}
</style>
