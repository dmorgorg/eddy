<script>
	// @ts-nocheck

	import { fade, fly } from 'svelte/transition';
	import { namedColors, colorGroups } from './functions';
	import { hexToRgb, hexToHsl, hslToRgb, rgbToValues } from './functions';
	import { getLightness, getIntensity, getBrightness } from './functions';

	// @ts-nocheck
	let selectionMode = $state('by-name'); // 'by-name' or 'by-group'
	let selectedColor = $state('DarkSeaGreen');
	let hexValue = $state('#8FBC8F');
	let rgbValue = $state('rgb(143 188 143)');
	let hslValue = $state('hsl(120deg 25% 65%)');
	let isValidHex = $state(true);
	let brightness = $derived(getBrightness(hexValue));
	let intensity = $derived(getIntensity(hexValue));
	let lightness = $derived(getLightness(hexValue));
	let headerText = $derived(brightness < 100 ? 'white' : 'black');
	let shaderOpen = $state(false);
	let shadeCount = $state(10);
	// @ts-ignore
	let shades = $state([]);
	let shadeVarName = $state('primary');
	let shadeVarCoding = $state('1');

	/**
	 * Extracts individual color values from an HSL string.
	 * @param {string} hsl - The HSL string (e.g., "hsl(120deg 25% 65%)" or "hsl(120, 25%, 65%)").
	 * @returns {object} - An object containing h, s, and l numeric values.
	 */
	function hslToValues(hsl) {
		// Remove "hsl(" and ")" and split by spaces or commas
		const cleanedStr = hsl.replace(/^hsl\(|\)$/g, '').trim();
		const parts = cleanedStr.split(/[\s,]+/);

		let h = parseInt(parts[0]);
		let s = parseInt(parts[1]);
		let l = parseInt(parts[2]);

		// Check if h has "deg" suffix and remove it
		if (isNaN(h) && typeof parts[0] === 'string' && parts[0].endsWith('deg')) {
			h = parseInt(parts[0].replace('deg', ''));
		}

		// Remove percentage symbols if present
		if (isNaN(s) && typeof parts[1] === 'string') {
			s = parseInt(parts[1].replace('%', ''));
		}
		if (isNaN(l) && typeof parts[2] === 'string') {
			l = parseInt(parts[2].replace('%', ''));
		}

		// Return default values if parsing fails
		return {
			h: isNaN(h) ? 0 : h,
			s: isNaN(s) ? 0 : s,
			l: isNaN(l) ? 0 : l
		};
	}

	/**
	 * Converts an HSL color string to an RGB color string.
	 * @param {string} hslString - The HSL string (e.g., "hsl(120deg 25% 65%)").
	 * @returns {string} - The color in RGB format (e.g., "rgb(143 188 143)").
	 */
	function hslStringToRgbString(hslString) {
		// Extract h, s, l values from the HSL string
		const { h, s, l } = hslToValues(hslString);

		// Convert HSL values to RGB values
		const { r, g, b } = hslToRgb(h, s, l);

		// Format as RGB string
		return `rgb(${r} ${g} ${b})`;
	}

	/**
	 * Converts an RGB color string to a hex color string.
	 * @param {string} rgbString - The RGB string (e.g., "rgb(143 188 143)").
	 * @returns {string} - The color in hex format (e.g., "#8FBC8F").
	 */
	function rgbStringToHexString(rgbString) {
		// Extract r, g, b values from the RGB string
		const { r, g, b } = rgbToValues(rgbString);

		// Convert RGB values to hex string
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
	}

	function updateFromNamedColor() {
		if (namedColors[selectedColor]) {
			hexValue = namedColors[selectedColor];
			rgbValue = hexToRgb(hexValue);
			hslValue = hexToHsl(hexValue);
			shadeMaker();
		}
	}
	// @ts-ignore
	function updateFromHex(e) {
		let hexInput = e.target.value;

		// Ensure the hex value has a # prefix
		if (!hexInput.startsWith('#')) {
			hexInput = '#' + hexInput;
		}

		// convert any lowercase letters to uppercase
		hexInput = hexInput.toUpperCase();

		if (hexInput.length > 7) {
			hexInput = hexInput.slice(0, 7);
		}

		// Regular expression to validate hex color format
		const hexRegex = /^#?([0-9A-Fa-f]{6})$/;

		if (hexRegex.test(hexInput)) {
			hexValue = hexInput.toUpperCase();
			rgbValue = hexToRgb(hexValue);
			hslValue = hexToHsl(hexValue);
			e.target.value = hexValue;
			isValidHex = true;
		} else {
			isValidHex = false;
			// Handle invalid hex color input
		}

		// // Check if the hex color matches a named color
		let colorName = Object.keys(namedColors).find((key) => namedColors[key] === hexValue);

		if (colorName) {
			selectedColor = colorName;
		} else {
			selectedColor = 'not a named color';
		}
		shadeMaker();
	}

	// @ts-ignore
	function updateFromRgb(e) {
		let rgbInput = e.target.value;

		const rgbRegex = /^rgb\(\s*(\d{1,3})\s*(?:,|\s)\s*(\d{1,3})\s*(?:,|\s)\s*(\d{1,3})\s*\)$/i;
		if (rgbRegex.test(rgbInput)) {
			// Remove "rgb(" and ")" and split by spaces or commas
			const cleanedStr = rgbInput.replace(/^rgb\(|\)$/g, '').trim();
			const [r, g, b] = cleanedStr.split(/[\s,]+/);
			if (r && g && b) {
				// Ensure the values are within the range of 0-255
				const rValue = Math.max(0, Math.min(255, parseInt(r)));
				const gValue = Math.max(0, Math.min(255, parseInt(g)));
				const bValue = Math.max(0, Math.min(255, parseInt(b)));

				// Convert to hex
				hexValue = `#${((1 << 24) + (rValue << 16) + (gValue << 8) + bValue).toString(16).slice(1).toUpperCase()}`;
				rgbValue = `rgb(${rValue} ${gValue} ${bValue})`;
				hslValue = hexToHsl(hexValue);

				// // Check if the hex color matches a named color
				let colorName = Object.keys(namedColors).find((key) => namedColors[key] === hexValue);

				if (colorName) {
					selectedColor = colorName;
				} else {
					selectedColor = 'not a named color';
				}
			}
		} else {
			e.target.value = rgbValue;
		}
		shadeMaker();
	}
	// @ts-ignore
	function updateFromHsl(e) {
		let hslInput = e.target.value;

		const hslRegex =
			/^hsl\(\s*(\d{1,3})(?:deg)?\s*(?:,|\s)\s*(\d{1,3})%\s*(?:,|\s)\s*(\d{1,3})%\s*\)$/i;
		if (hslRegex.test(hslInput)) {
			// Remove "hsl(" and ")" and split by spaces or commas
			const cleanedStr = hslInput.replace(/^hsl\(|\)$/g, '').trim();
			const parts = cleanedStr.split(/[\s,]+/);

			let h = parseInt(parts[0]);
			let s = parseInt(parts[1]);
			let l = parseInt(parts[2]);

			// Check if h has "deg" suffix and remove it
			if (isNaN(h) && parts[0].endsWith('deg')) {
				h = parseInt(parts[0].replace('deg', ''));
			}

			// Ensure values are within valid range
			h = Math.max(0, Math.min(360, h));
			s = Math.max(0, Math.min(100, s));
			l = Math.max(0, Math.min(100, l));

			// Convert HSL to RGB
			const rgb = hslToRgb(h, s, l);

			// Convert RGB to hex
			// @ts-ignore
			hexValue = `#${((1 << 24) + (parseInt(rgb.r) << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1).toUpperCase()}`;
			// @ts-ignore
			rgbValue = `rgb(${rgb.r} ${rgb.g} ${rgb.b})`;
			hslValue = `hsl(${h}deg ${s}% ${l}%)`;

			// Check if the hex color matches a named color
			let colorName = Object.keys(namedColors).find((key) => namedColors[key] === hexValue);

			if (colorName) {
				selectedColor = colorName;
			} else {
				selectedColor = 'not a named color';
			}
		} else {
			e.target.value = hslValue;
		}
		shadeMaker();
	}

	function shadeMaker() {
		shades = [];
		let hsl = hslToValues(hslValue);
		// @ts-ignore
		let h = hsl.h;
		// @ts-ignore
		let s = hsl.s;
		let swatchWidth = Math.round(10000 / (shadeCount + 2)) / 100;
		let sW = swatchWidth;
		let brighter = Math.ceil((100 - lightness) / sW - 2);
		let darker = Math.ceil(lightness / sW - 2);
		let brandIndex = darker;
		let startingLightness = lightness - darker * sW;
		for (let index = -darker; index <= brighter; index++) {
			let arr = new Array();
			let hsl = `hsl(${h}deg ${s}% ${Math.round(startingLightness + (index + darker) * sW)}%)`;
			let rgb = hslStringToRgbString(hsl);
			let hex = rgbStringToHexString(rgb);
			// let hex = rgb(1).toUpperCase()}`;
			arr.push(index);
			arr.push(hex);
			arr.push(rgb);
			arr.push(hsl);
			shades.push(arr);
		}
		shades = shades.reverse();
		console.log(shades);
	}
</script>

<div class="outer" style:background-color={hexValue === '#FFFFFF' ? '#eee' : 'white'}>
	<!-- Hex: {hexValue} Brightness: {getBrightness(hexValue)} Intensity: {intensity} -->

	<div class="container">
		<div class="separator"></div>
		<header style:background-color={hexValue} style:color={headerText}>
			<h1>Color Code Converter</h1>
		</header>
		<div class="named">
			<div class="colorByName-group">
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
					style:color={headerText}
				>
					{#if selectedColor == 'not a named color'}
						<option value={selectedColor}>Not a named color</option>
					{:else}
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
					style:color={headerText}
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
				<div class="encoding-name">Hex</div>
				<div class="units">(#RRGGBB)</div>
				<input
					type="text"
					value={hexValue}
					oninput={updateFromHex}
					class="input-box hex-input"
					spellcheck="false"
					style:background-color={hexValue}
					style:color={headerText}
				/>
			</div>
			<div>
				<div class="encoding-name">RGB</div>
				<div class="units">(0-255 &nbsp;0-255 &nbsp;0-255)</div>
				<input
					type="text"
					value={rgbValue}
					oninput={updateFromRgb}
					class="input-box rgb-input"
					spellcheck="false"
					style:background-color={hexValue}
					style:color={headerText}
				/>
			</div>
			<div>
				<div class="encoding-name">HSL</div>
				<div class="units">(0-360deg &nbsp;0-100% &nbsp;0-100%)</div>
				<input
					type="text"
					value={hslValue}
					oninput={updateFromHsl}
					class="input-box hsl-input"
					spellcheck="false"
					style:background-color={hexValue}
					style:color={headerText}
				/>
			</div>
		</div>

		<div class="separator"></div>

		<header
			style:background-color={hexValue}
			style:color={headerText}
			role="button"
			tabindex="0"
			onclick={() => {
				shaderOpen = !shaderOpen;
				shadeMaker();
			}}
			onkeydown={(e) => {
				// to remove error wiggleys
				e.preventDefault();
			}}
		>
			<h1>Color Shader</h1>
			<div class="fright triangle" aria-label="Toggle color shader">
				{@html shaderOpen && headerText === 'black'
					? '&#x25b2;'
					: shaderOpen
						? '&#x25b3;'
						: headerText === 'black'
							? '&#x25bc;'
							: '&#x25bd;'}
			</div>
		</header>
		{#if shaderOpen}
			<section class="shader" transition:fly={{ y: -20, duration: 100 }}>
				<div class="shader-controls">
					<label for="quantity">Number of shades<br /> (between 5 and 20):</label>
					<input
						type="number"
						id="quantity"
						name="quantity"
						min="5"
						max="20"
						onchange={shadeMaker}
						bind:value={shadeCount}
						style:background-color={hexValue}
						style:color={headerText}
					/>
					<div class="separatorSkinny"></div>
					<label for="name">Variable name:</label>
					<input
						class="input-box varName-input"
						type="text"
						id="name"
						name="name"
						size="10"
						spellcheck="false"
						bind:value={shadeVarName}
						style:background-color={hexValue}
						style:color={headerText}
					/>
					<div class="separatorSkinny"></div>
					<div>Color coding:</div>
					<div class="var-encoding-group">
						<div class="hexCoding">
							<label for="hex">Hex</label>
							<input
								type="radio"
								bind:group={shadeVarCoding}
								value="1"
								style:background-color={shadeVarCoding === '1' && hexValue !== '#ffffff'
									? hexValue
									: shadeVarCoding === '1'
										? 'Silver'
										: 'transparent'}
							/>
						</div>
						<div class="rgbCoding">
							<label for="rgb">RGB</label>
							<input
								type="radio"
								bind:group={shadeVarCoding}
								value="2"
								style:background-color={shadeVarCoding === '2' && hexValue !== '#ffffff'
									? hexValue
									: shadeVarCoding === '2'
										? 'Silver'
										: 'transparent'}
							/>
						</div>
						<div class="hslCoding">
							<label for="hsl">HSL</label>
							<input
								type="radio"
								bind:group={shadeVarCoding}
								value="3"
								style:background-color={shadeVarCoding === '3' && hexValue !== '#ffffff'
									? hexValue
									: shadeVarCoding === '3'
										? 'Silver'
										: 'transparent'}
							/>
						</div>
					</div>
				</div>
				<div class="shades">
					{#each shades as color}
						<div class="shade">
							<div class="swatch" style:background-color={color[1]}></div>
							<div class="variable-code">
								--{shadeVarName}{color[0] < 0
									? color[0]
									: color[0] === 0
										? ''
										: '-plus' + color[0]}: {color[Number(shadeVarCoding)]};
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<div class="separator"></div>

		<header style:background-color={hexValue} style:color={headerText}>
			<h1>Two-Color Blender</h1>
		</header>

		<div class="separator"></div>
		{selectedColor}: {lightness}%
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
			width: 40rem;

			header {
				border-radius: 0.25rem;
				box-shadow: var(--shadow-4);
				color: black;
				display: block;
				font-weight: bold;
				padding: 0.5rem;
				position: relative;
				text-align: center;
				transition:
					background-color 0.3s,
					color 0.3s;
				width: 100%;

				h1 {
					display: inline-block;
					font-family: 'AlkesRgIt';
					font-size: 2em;
					margin-inline: auto;
				}

				.triangle {
					font-size: 1.5rem;
					padding-right: 1rem;
					position: absolute;
					right: 0;
					top: 0.5rem;
				}
			}

			input[type='radio'] {
				appearance: none;
				background-color: transparent;
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
				}
			}

			section.shader {
				display: flex;
				justify-content: space-around;
				align-items: stretch;
				width: 100%;
				// background-color: #eee;

				div.shader-controls {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					gap: 0.5rem;
					// justify-content: flex-start;
					// justify-content: center;
					line-height: 1.3;

					.var-encoding-group {
						display: flex;
						// flex direction needs to be row to override parent?
						flex-direction: row;
						justify-content: space-around;
						padding-bottom: 2rem;
						position: relative;
						width: 100%;
						// background-color: pink;

						input[type='radio'] {
							top: 1.5rem;
						}

						.hexCoding,
						.rgbCoding,
						.hslCoding {
							display: flex;
							flex-direction: column;
							align-items: center;
							font-weight: 500;
							gap: 0.125rem;
							padding-inline: 1rem;
						}
					}
				}
				div.shades {
					display: flex;
					flex-direction: column;
					// height: 100%;
					justify-content: center;
					.shade {
						display: flex;
						.swatch {
							border-radius: 0.25rem;
							display: inline;
							margin-block: 0.25rem;
							margin-right: 1rem;
							min-width: 4rem;
							width: 4rem;
							height: 1.5rem;
							transition: all 0.3s;
						}
						.variable-code {
							display: inline;
							margin-block: 0.25rem;
							// width: 20rem;
							font-family: 'Courier New', Courier, monospace;
							font-size: 80%;
							// background-color: #eee;
							padding: 0.125rem;
						}
					}
				}
			}

			.separator {
				border-radius: 0.25rem;
				background-color: silver;
				width: 100%;
				height: 1rem;
			}
			.separatorSkinny {
				border-radius: 0.125rem;
				background-color: silver;
				width: 100%;
				height: 0.25rem;
				margin: 1rem auto;
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

			.colorByName-group {
				display: flex;
				justify-content: space-between;
				position: relative;

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
				justify-content: space-between;
				align-items: center;
				width: 100%;

				div {
					display: flex;
					align-items: center;
					gap: 0.25rem;
					flex-direction: column;

					.encoding-name {
						font-weight: 500;
						margin-bottom: -0.5rem;
					}
				}
			}
			input[type='number'] {
				border: none;
				border-radius: 4px;
				box-shadow: var(--shadow-4);
				outline: none;
				font-family: inherit;
				font-size: inherit;
				cursor: inherit;
				line-height: inherit;
				// margin-top: -0.5rem;
				padding: 0.25rem;
				text-align: center;
				transition:
					background-color 0.3s,
					color 0.3s;
				width: 5rem;
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
				text-align: center;
				transition:
					background-color 0.3s,
					color 0.3s;
				width: 11rem;

				&.hsl-input {
					width: 14rem;
				}
				&.varName-input {
					// margin-top: -0.5rem;
					width: 8rem;
				}
			}
		}
	}
</style>
