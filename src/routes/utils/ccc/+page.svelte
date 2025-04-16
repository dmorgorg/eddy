<script>
	// @ts-nocheck

	import { fade, fly } from 'svelte/transition';
	import { namedColors, colorGroups } from './functions';
	import { hexToRgb, hexToHsl, hslToRgb, rgbToValues } from './functions';
	import { getLightness, getIntensity, getBrightness } from './functions';
	import HomeLink from '$lib/components/HomeLink.svelte';

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
	let headerText = $derived(lightness < 40 ? 'white' : 'black');

	let shaderOpen = $state(false);
	let blenderOpen = $state(false);
	let shadeCount = $state(10);
	let blendCount = $state(10);
	let shades = $state([]);
	let shadeVarName = $state('primary');
	let shadeVarCoding = $state('1');

	let blends = $state([]);
	let fromTo = $state('from');
	// let fromColorNamed = $state('DarkSeaGreen');
	// let fromColorHex = $state('#8FBC8F');
	let fromColorRgb = $state('rgb(143 188 143)');
	// let fromColorHsl = $state('hsl(120deg 25% 65%)');
	// let toColorNamed = $state('Crimson');
	// let toColorHex = $state('#8FBC8F');
	let toColorRgb = $state('rgb(143 188 143)');
	// let toColorHsl = $state('hsl(120deg 25% 65%)');
	let blendVarName = $state('primary');
	let blendEncoding = $state('1');
	let blendAverageForBg = $derived(getAverageRgb(fromColorRgb, toColorRgb));
	let isBlenderSet = $state(false);
	let headerTextFrom = $derived(
		getLightness(rgbToHex(fromColorRgb ? fromColorRgb : 'red')) < 40 ? 'white' : 'black'
	);
	let headerTextTo = $derived(getLightness(rgbToHex(toColorRgb)) < 40 ? 'white' : 'black');

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
	function rgbToHex(rgbString) {
		// Extract r, g, b values from the RGB string
		const { r, g, b } = rgbToValues(rgbString);

		// Convert RGB values to hex string
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
	}

	/**
	 * Calculates the average of two RGB colors.
	 * @param {string} rgbColor1 - First RGB color string (e.g., "rgb(143 188 143)")
	 * @param {string} rgbColor2 - Second RGB color string (e.g., "rgb(200 100 50)")
	 * @returns {string} - The average RGB color as a string (e.g., "rgb(171 144 96)")
	 */
	function getAverageRgb(rgbColor1, rgbColor2) {
		// Extract RGB values from both colors
		const color1 = rgbToValues(rgbColor1);
		const color2 = rgbToValues(rgbColor2);

		// Calculate average values
		const avgR = Math.round((color1.r + color2.r) / 2);
		const avgG = Math.round((color1.g + color2.g) / 2);
		const avgB = Math.round((color1.b + color2.b) / 2);

		// Return as RGB string
		return `rgb(${avgR} ${avgG} ${avgB})`;
	}

	// function updateFrom() {

	// }

	function updateFromNamedColor() {
		if (namedColors[selectedColor]) {
			hexValue = namedColors[selectedColor];
			rgbValue = hexToRgb(hexValue);
			hslValue = hexToHsl(hexValue);
			shadeMaker();
			blendMaker();
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

		checkForNamedColor();
		shadeMaker();
		blendMaker();
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

				checkForNamedColor();
			}
		} else {
			e.target.value = rgbValue;
		}
		shadeMaker();
		blendMaker();
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

			checkForNamedColor();
		} else {
			e.target.value = hslValue;
		}
		shadeMaker();
		blendMaker();
	}
	function checkForNamedColor() {
		// Check if the hex color matches a named color
		let colorName = Object.keys(namedColors).find((key) => namedColors[key] === hexValue);

		if (colorName) {
			selectedColor = colorName;
		} else {
			selectedColor = 'not a named color';
		}
	}

	function shadeMaker() {
		shades = [];
		let hsl = hslToValues(hslValue);
		let h = hsl.h;
		let s = hsl.s;
		let swatchWidth = Math.round(8000 / shadeCount) / 100;
		let sW = swatchWidth;
		let brighter = Math.ceil((100 - lightness) / sW - 2);
		let darker = shadeCount - brighter - 1;
		let brandIndex = darker;
		let startingLightness = lightness - darker * sW;
		for (let index = -darker; index <= brighter; index++) {
			let arr = new Array();
			let hsl = `hsl(${h}deg ${s}% ${Math.round(startingLightness + (index + darker) * sW)}%)`;
			let rgb = hslStringToRgbString(hsl);
			let hex = rgbToHex(rgb);
			arr.push(index);
			arr.push(hex);
			arr.push(rgb);
			arr.push(hsl);
			shades.push(arr);
		}
		shades = shades.reverse();
	}
	function toggleShader() {
		shaderOpen = !shaderOpen;
		shadeMaker();
	}
	function toggleBlender() {
		// once the blender has been opened, and is still open, set blend colors only
		// if the blender has been opened, but is now closed, no longer update with other color changes
		blenderOpen = !blenderOpen;
		isBlenderSet = true;
		if (blenderOpen) {
			blendMaker();
		}
	}

	function blendMaker() {
		blends = [];
		let blendRValues = [];
		let blendGValues = [];
		let blendBValues = [];

		if (!isBlenderSet) {
			fromColorRgb = rgbValue;
			toColorRgb = rgbValue;
			return;
		} else if (blenderOpen && fromTo === 'from') {
			fromColorRgb = rgbValue;
		} else if (blenderOpen && fromTo === 'to') {
			toColorRgb = rgbValue;
		}

		let fromColor = rgbToValues(fromColorRgb);
		let toColor = rgbToValues(toColorRgb);
		let deltaR = fromColor.r - toColor.r;
		let deltaG = fromColor.g - toColor.g;
		let deltaB = fromColor.b - toColor.b;
		let incrementR = deltaR / (blendCount - 1);
		let incrementG = deltaG / (blendCount - 1);
		let incrementB = deltaB / (blendCount - 1);
		blendRValues.push(fromColor.r);
		blendGValues.push(fromColor.g);
		blendBValues.push(fromColor.b);
		for (let index = 1; index < blendCount; index++) {
			let arr = new Array();
			let rValue = Math.round(fromColor.r - incrementR * index);
			let gValue = Math.round(fromColor.g - incrementG * index);
			let bValue = Math.round(fromColor.b - incrementB * index);
			blendRValues.push(rValue);
			blendGValues.push(gValue);
			blendBValues.push(bValue);
		}
		blendRValues.push(toColor.r);
		blendGValues.push(toColor.g);
		blendBValues.push(toColor.b);

		for (let index = 0; index < blendCount; index++) {
			let arr = new Array();
			let rValue = Math.round(blendRValues[index]);
			let gValue = Math.round(blendGValues[index]);
			let bValue = Math.round(blendBValues[index]);
			let rgb = `rgb(${rValue} ${gValue} ${bValue})`;
			let hex = rgbToHex(rgb);
			let hsl = hexToHsl(hex);
			arr.push(index);
			arr.push(hex);
			arr.push(rgb);
			arr.push(hsl);
			blends.push(arr);
		}
	}

	function fromToChange() {
		if (fromTo === 'from') {
			rgbValue = fromColorRgb;
			hexValue = rgbToHex(fromColorRgb);
			hslValue = hexToHsl(hexValue);
		} else if (fromTo === 'to') {
			rgbValue = toColorRgb;
			hexValue = rgbToHex(toColorRgb);
			hslValue = hexToHsl(hexValue);
		}
		checkForNamedColor();
		shadeMaker();
		// blendMaker();
	}
</script>

<div class="outer" style:background-color={hexValue === '#FFFFFF' ? '#eee' : 'white'}>
	<!-- Hex: {hexValue} Brightness: {getBrightness(hexValue)} Intensity: {intensity} -->
	<HomeLink color={hexValue} shadow="black" />
	<div class="container">
		<div class="separator"></div>
		<header style:background-color={hexValue} style:color={headerText}>
			<h1>Color Code Converter</h1>
		</header>
		<div class="picker">
			<img src="/dropper-solid.png" alt="" class="dropper" /><input
				type="color"
				bind:value={hexValue}
				oninput={updateFromHex}
				id="swatch"
			/>
		</div>
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
					<div><label for="radio1"> <strong>Select</strong> Color by Name </label></div>
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
					<label for="radio2"> <strong>Select</strong> Color from Grouping </label>
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
			<div class="hex">
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
			<div class="rgb">
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
			<div class="hsl">
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
			onclick={toggleShader}
			onkeydown={(e) => {
				// to remove error wigglies
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
			<section class="shader" transition:fly={{ y: -20, duration: 200 }}>
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
					<div>Encoding:</div>
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
								<!-- color[0] is the array index  -->
								--{shadeVarName}{color[0] < 0 ? color[0] : color[0] === 0 ? '' : '--' + color[0]}: {color[
									Number(shadeVarCoding)
								]};
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<div class="separator"></div>

		<header
			class="blender"
			style="--from-color: {fromColorRgb}; --to-color: {toColorRgb};"
			style:color={headerText}
			role="button"
			tabindex="0"
			onclick={toggleBlender}
			onkeydown={(e) => {
				// to remove error wigglies
				e.preventDefault();
			}}
		>
			<h1
				style="--from-color-text: {headerTextFrom}; --to-color-text: {headerTextTo};"
				class="blender-text"
			>
				Two-Color Blender
			</h1>

			<div class="fright triangle" aria-label="Toggle color blender">
				{@html blenderOpen && headerText === 'black'
					? '&#x25b2;'
					: blenderOpen
						? '&#x25b3;'
						: headerText === 'black'
							? '&#x25bc;'
							: '&#x25bd;'}
			</div>
		</header>

		<!-- {headerTextFrom}: {headerTextTo} -->
		{#if blenderOpen}
			<section class="blender" transition:fly={{ y: -20, duration: 100 }}>
				<div class="blender-controls">
					<div class="fromTo-group">
						<p>
							<label for="fromColor"><strong>From</strong> Color:</label>
							<input
								type="radio"
								bind:group={fromTo}
								value="from"
								id="fromColor"
								name="fromColor"
								onchange={fromToChange}
								style:background-color={fromColorRgb}
							/>
						</p>
					</div>
					<div class="fromTo-group">
						<!-- <div class="separatorSkinny"></div> -->
						<p>
							<label for="toColor"><strong>To</strong> Color:</label>
							<input
								type="radio"
								bind:group={fromTo}
								value="to"
								id="toColor"
								name="toColor"
								onchange={fromToChange}
								style:background-color={toColorRgb}
							/>
						</p>
					</div>
					<div class="separatorSkinny"></div>
					<label for="quantity">Number of blends<br /> (between 5 and 20):</label>
					<input
						type="number"
						id="quantity"
						name="quantity"
						min="5"
						max="20"
						onchange={blendMaker}
						bind:value={blendCount}
						style:background-color={getAverageRgb(fromColorRgb, toColorRgb)}
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
						bind:value={blendVarName}
						style:background-color={getAverageRgb(fromColorRgb, toColorRgb)}
						style:color={headerText}
					/>
					<div class="separatorSkinny"></div>
					<div>Encoding:</div>
					<div class="var-encoding-group">
						<div class="hexCoding">
							<label for="hex">Hex</label>
							<input
								type="radio"
								bind:group={blendEncoding}
								value="1"
								style:background-color={blendEncoding === '1' &&
								getAverageRgb(fromColorRgb, toColorRgb) !== '#ffffff'
									? getAverageRgb(fromColorRgb, toColorRgb)
									: blendEncoding === '1'
										? 'Silver'
										: 'transparent'}
							/>
						</div>
						<div class="rgbCoding">
							<label for="rgb">RGB</label>
							<input
								type="radio"
								bind:group={blendEncoding}
								value="2"
								style:background-color={blendEncoding === '2' &&
								getAverageRgb(fromColorRgb, toColorRgb) !== '#ffffff'
									? getAverageRgb(fromColorRgb, toColorRgb)
									: blendEncoding === '2'
										? 'Silver'
										: 'transparent'}
							/>
						</div>
						<div class="hslCoding">
							<label for="hsl">HSL</label>
							<input
								type="radio"
								bind:group={blendEncoding}
								value="3"
								style:background-color={blendEncoding === '3' &&
								getAverageRgb(fromColorRgb, toColorRgb) !== '#ffffff'
									? getAverageRgb(fromColorRgb, toColorRgb)
									: blendEncoding === '3'
										? 'Silver'
										: 'transparent'}
							/>
						</div>
					</div>
				</div>
				<div class="blends">
					{#each blends as color}
						<div class="shade">
							<div class="swatch" style:background-color={color[1]}></div>
							<div class="variable-code">
								--{blendVarName}-{color[0] + 1}: {color[Number(blendEncoding)]};
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<div class="separator"></div>
	</div>
</div>

<style lang="scss">
	.outer {
		background-color: white;
		background-color: #cccaaa;
		// font-size: 2.25vw;
		width: 100%;
		min-height: 100vh;
		overflow-y: auto;
		padding: 0;
	}

	.container {
		align-items: center;
		background-color: transparent;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-inline: auto;
		width: 40rem;
		// border: 1px solid black;
	}

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
			font-size: 200%;
			margin-inline: auto;

			&.blender-text {
				background: linear-gradient(to right, var(--from-color-text), var(--to-color-text));
				-webkit-background-clip: text;
				-moz-background-clip: text;
				-ms-background-clip: text;
				-o-background-clip: text;
				background-clip: text;
				color: transparent;
			}
		}

		.triangle {
			font-size: 1.5rem;
			padding-right: 1rem;
			position: absolute;
			right: 0;
			top: 0.5rem;
		}

		&.blender {
			background: linear-gradient(to right, var(--from-color), var(--to-color));
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

	section {
		display: flex;
		justify-content: space-around;
		align-items: stretch;
		width: 100%;

		.shader-controls,
		.blender-controls {
			display: flex;
			flex-basis: 30%;
			flex-direction: column;
			align-items: flex-end;
			gap: 0.5rem;
			line-height: 1.3;
			label {
				text-align: right;
			}
			div.fromTo-group {
				position: relative;
				text-align: right;

				label {
					margin-right: 2rem;
				}
				input[type='radio'] {
					right: 0;
				}
			}
			.var-encoding-group {
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				padding-bottom: 2rem;
				position: relative;
				width: 100%;

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
					padding-left: 1rem;
				}
			}
		}

		div.blends,
		div.shades {
			display: flex;
			flex-direction: column;
			flex-basis: 60%;
			justify-content: center;
			.shade {
				display: flex;
			}
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
				font-family: 'Courier New', Courier, monospace;
				font-size: 80%;
				padding: 0.125rem;
			}
		}
	}

	.separator {
		border-radius: 0.2rem;
		background-color: silver;
		width: 100%;
		height: 0.375rem;
		margin-block: 0;
	}
	.separatorSkinny {
		border-radius: 0.125rem;
		background-color: silver;
		width: 100%;
		height: 0.25rem;
		margin: 1rem auto;
	}

	.dropper {
		height: 2.5rem;
	}

	.picker {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 100%;

		#swatch {
			-moz-appearance: none;
			-webkit-appearance: none;
			appearance: none;
			background: none;
			box-shadow: var(--shadow-4);
			border: none;
			cursor: pointer;
			padding: 0;
			border-radius: 4px;
			transition:
				background-color 0.3s,
				color 0.3s;
			width: 5rem;
			height: 2.25rem;
		}

		#swatch::-webkit-color-swatch {
			border-radius: 4px;
			border: none;
		}
		#swatch::-webkit-color-swatch-wrapper {
			padding: 0;
		}
		#swatch::-moz-color-swatch {
			border-radius: 15px;
			border: none;
		}
	}

	.named {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		select {
			border: none;
			border-radius: 4px;
			box-shadow: var(--shadow-4);
			outline: none;
			font-family: inherit;
			font-size: inherit;
			cursor: pointer;
			line-height: inherit;
			padding: 0.5rem;
			transition:
				background-color 0.3s,
				color 0.3s;
			width: 14rem;
		}
	}

	.colorByName-group {
		align-items: center;
		display: flex;
		justify-content: space-between;
		position: relative;

		label {
			display: inline-block;
			font-size: 90%;
			margin-left: 1.75rem;
			padding-right: 1rem;
		}
	}

	.text-inputs {
		// display: inline-block;
		display: flex;
		justify-content: space-between;
		// align-items: baseline;
		gap: 1rem;
		flex: content;
		width: 100%;
		// border: 1px solid red;

		div {
			display: flex;
			align-items: center;
			flex-direction: column;
			gap: 0.25rem;

			// &.hex {
			// 	width: 20%;
			// }
			// &.rgb {
			// 	width: 30%;
			// }
			// &.hsl {
			// 	width: 40%;
			// }

			input {
				width: 100%;
			}

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

	@media (max-width: 700px) {
		.container {
			width: 100%;
			font-size: 0.75rem;
			padding-inline: 0.5rem;
		}
		header h1 {
			font-size: 150%;
		}

		input[type='text'] {
			width: 85%;
		}
		input[type='number'] {
			width: 50%;
		}
	}
</style>
