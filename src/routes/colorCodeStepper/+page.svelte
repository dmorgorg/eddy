<script>
	// @ts-nocheck

	/** @type {{ [key: string]: string }} */
	let namedColors = {
		AliceBlue: '#F0F8FF',
		AntiqueWhite: '#FAEBD7',
		Aqua: '#00FFFF',
		Aquamarine: '#7FFFD4',
		Azure: '#F0FFFF',
		Beige: '#F5F5DC',
		Bisque: '#FFE4C4',
		Black: '#000000',
		BlanchedAlmond: '#FFEBCD',
		Blue: '#0000FF',
		BlueViolet: '#8A2BE2',
		Brown: '#A52A2A',
		BurlyWood: '#DEB887',
		CadetBlue: '#5F9EA0',
		Chartreuse: '#7FFF00',
		Chocolate: '#D2691E',
		Coral: '#FF7F50',
		CornflowerBlue: '#6495ED',
		Cornsilk: '#FFF8DC',
		Crimson: '#DC143C',
		Cyan: '#00FFFF',
		DarkBlue: '#00008B',
		DarkCyan: '#008B8B',
		DarkGoldenRod: '#B8860B',
		DarkGray: '#A9A9A9',
		DarkGreen: '#006400',
		DarkKhaki: '#BDB76B',
		DarkMagenta: '#8B008B',
		DarkOliveGreen: '#556B2F',
		DarkOrange: '#FF8C00',
		DarkOrchid: '#9932CC',
		DarkRed: '#8B0000',
		DarkSalmon: '#E9967A',
		DarkSeaGreen: '#8FBC8F',
		DarkSlateBlue: '#483D8B',
		DarkSlateGray: '#2F4F4F',
		DarkTurquoise: '#00CED1',
		DarkViolet: '#9400D3',
		DeepPink: '#FF1493',
		DeepSkyBlue: '#00BFFF',
		DimGray: '#696969',
		DodgerBlue: '#1E90FF',
		FireBrick: '#B22222',
		FloralWhite: '#FFFAF0',
		ForestGreen: '#228B22',
		Fuchsia: '#FF00FF',
		Gainsboro: '#DCDCDC',
		GhostWhite: '#F8F8FF',
		Gold: '#FFD700',
		GoldenRod: '#DAA520',
		Gray: '#808080',
		Green: '#008000',
		GreenYellow: '#ADFF2F',
		HoneyDew: '#F0FFF0',
		HotPink: '#FF69B4',
		IndianRed: '#CD5C5C',
		Indigo: '#4B0082',
		Ivory: '#FFFFF0',
		Khaki: '#F0E68C',
		Lavender: '#E6E6FA',
		LavenderBlush: '#FFF0F5',
		LawnGreen: '#7CFC00',
		LemonChiffon: '#FFFACD',
		LightBlue: '#ADD8E6',
		LightCoral: '#F08080',
		LightCyan: '#E0FFFF',
		LightGoldenRodYellow: '#FAFAD2',
		LightGray: '#D3D3D3',
		LightGreen: '#90EE90',
		LightPink: '#FFB6C1',
		LightSalmon: '#FFA07A',
		LightSeaGreen: '#20B2AA',
		LightSkyBlue: '#87CEFA',
		LightSlateGray: '#778899',
		LightSteelBlue: '#B0C4DE',
		LightYellow: '#FFFFE0',
		Lime: '#00FF00',
		LimeGreen: '#32CD32',
		Linen: '#FAF0E6',
		Magenta: '#FF00FF',
		Maroon: '#800000',
		MediumAquaMarine: '#66CDAA',
		MediumBlue: '#0000CD',
		MediumOrchid: '#BA55D3',
		MediumPurple: '#9370DB',
		MediumSeaGreen: '#3CB371',
		MediumSlateBlue: '#7B68EE',
		MediumSpringGreen: '#00FA9A',
		MediumTurquoise: '#48D1CC',
		MediumVioletRed: '#C71585',
		MidnightBlue: '#191970',
		MintCream: '#F5FFFA',
		MistyRose: '#FFE4E1',
		Moccasin: '#FFE4B5',
		NavajoWhite: '#FFDEAD',
		Navy: '#000080',
		OldLace: '#FDF5E6',
		Olive: '#808000',
		OliveDrab: '#6B8E23',
		Orange: '#FFA500',
		OrangeRed: '#FF4500',
		Orchid: '#DA70D6',
		PaleGoldenRod: '#EEE8AA',
		PaleGreen: '#98FB98',
		PaleTurquoise: '#AFEEEE',
		PaleVioletRed: '#DB7093',
		PapayaWhip: '#FFEFD5',
		PeachPuff: '#FFDAB9',
		Peru: '#CD853F',
		Pink: '#FFC0CB',
		Plum: '#DDA0DD',
		PowderBlue: '#B0E0E6',
		Purple: '#800080',
		RebeccaPurple: '#663399',
		Red: '#FF0000',
		RosyBrown: '#BC8F8F',
		RoyalBlue: '#4169E1',
		SaddleBrown: '#8B4513',
		Salmon: '#FA8072',
		SandyBrown: '#F4A460',
		SeaGreen: '#2E8B57',
		SeaShell: '#FFF5EE',
		Sienna: '#A0522D',
		Silver: '#C0C0C0',
		SkyBlue: '#87CEEB',
		SlateBlue: '#6A5ACD',
		SlateGray: '#708090',
		Snow: '#FFFAFA',
		SpringGreen: '#00FF7F',
		SteelBlue: '#4682B4',
		Tan: '#D2B48C',
		Teal: '#008080',
		Thistle: '#D8BFD8',
		Tomato: '#FF6347',
		Turquoise: '#40E0D0',
		Violet: '#EE82EE',
		Wheat: '#F5DEB3',
		White: '#FFFFFF',
		WhiteSmoke: '#F5F5F5',
		Yellow: '#FFFF00',
		YellowGreen: '#9ACD32'
	};

	let selectedColor = $state('');
	let hexValue = $state('');
	let rgbValue = $state('');
	let hslValue = $state('');
	let selectionMode = $state('name'); // 'name' or 'group'

	/**
	 * @param {string} hex
	 */
	function hexToRgb(hex) {
		// let bigint = parseInt(hex.slice(1), 16);
		let r = getRedFromHex(hex);
		let g = getGreenFromHex(hex);
		let b = getBlueFromHex(hex);

		return [r, g, b];
	}

	/**
	 * @param {string} hex
	 * @returns {number}
	 */
	function getRedFromHex(hex) {
		return parseInt(hex.slice(1, 3), 16);
	}
	/**
	 * @param {string} hex
	 * @returns {number}
	 */
	function getGreenFromHex(hex) {
		return parseInt(hex.slice(3, 5), 16);
	}
	/**
	 * @param {string} hex
	 * @returns {number}
	 */
	function getBlueFromHex(hex) {
		return parseInt(hex.slice(5, 7), 16);
	}

	/**
	 * @param {number[]} rgb
	 * @returns {string}
	 */
	function rgbToHex([r, g, b]) {
		r = r.toString(16).length === 1 ? '0' + r.toString(16) : r.toString(16);
		g = g.toString(16).length === 1 ? '0' + g.toString(16) : g.toString(16);
		b = b.toString(16).length === 1 ? '0' + b.toString(16) : b.toString(16);

		return '#' + r + g + b;
	}

	// https://gist.github.com/mjackson/5311256
	function rgbToHsl([r, g, b]) {
		r /= 255;
		g /= 255;
		b /= 255;
		let max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			h,
			s,
			l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // achromatic
		} else {
			let d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
			h = Math.round(h * 360);
			s = Math.round(s * 100);
			l = Math.round(l * 100);
		}

		return [h, s, l];
	}

	// https://css-tricks.com/converting-color-spaces-in-javascript/
	function hslToRgb([h, s, l]) {
		let r, g, b, c, x, m;
		// convert from percentages to [0, 1] range
		s /= 100;
		l /= 100;

		if (s === 0) {
			r = g = b = l; // achromatic}
		} else {
			// c is the chroma value, which is the color intensity
			c = (1 - Math.abs(2 * l - 1)) * s;
			// x is the second largest component of the color
			x = c * (1 - Math.abs(((h / 60) % 2) - 1));
			m = l - c / 2;
			// calculate the rgb values
			if (0 <= h && h < 60) {
				r = c;
				g = x;
				b = 0;
			} else if (60 <= h && h < 120) {
				r = x;
				g = c;
				b = 0;
			} else if (120 <= h && h < 180) {
				r = 0;
				g = c;
				b = x;
			} else if (180 <= h && h < 240) {
				r = 0;
				g = x;
				b = c;
			} else if (240 <= h && h < 300) {
				r = x;
				g = 0;
				b = c;
			} else if (300 <= h && h < 360) {
				r = c;
				g = 0;
				b = x;
			}
			// add the m value to each component
			r = Math.round((r + m) * 255);
			g = Math.round((g + m) * 255);
			b = Math.round((b + m) * 255);
		}

		return [r, g, b];
	}

	function hexToHsl(hex) {
		return rgbToHsl(hexToRgb(hex));
	}

	function hslToHex([h, s, l]) {
		return rgbToHex(hslToRgb([h, s, l]));
	}

	function updateValues() {
		if (namedColors[selectedColor]) {
			hexValue = namedColors[selectedColor];
			rgbValue = hexToRgb(hexValue);
		} else {
			selectedColor = 'Not a named color';
			hexValue = '';
			rgbValue = '';
		}
		hslValue = hexToHsl(hexValue);
		updateInputBackgrounds();
	}

	function updateFromHex() {
		let colorName = Object.keys(namedColors).find(
			(key) => namedColors[key].toUpperCase() === hexValue.toUpperCase()
		);
		if (colorName) {
			selectedColor = colorName;
		} else {
			selectedColor = 'not a named color';
		}
		rgbValue = hexToRgb(hexValue);
		hslValue = hexToHsl(hexValue);
		updateInputBackgrounds();
	}

	function updateFromRgb() {
		console.log('rgbValue', rgbValue);
		const hex = rgbToHex(rgbValue);
		let colorName = Object.keys(namedColors).find(
			(key) => namedColors[key].toUpperCase() === hex.toUpperCase()
		);
		if (colorName) {
			selectedColor = colorName;
			hexValue = hex;
		} else {
			selectedColor = 'not a named color';
			hexValue = hex;
		}
		hslValue = hexToHsl(hexValue);
		updateInputBackgrounds();
	}

	function updateFromHsl() {
		const hslParts = hslValue.match(/\d+/g);
		if (hslParts && hslParts.length === 3) {
			const h = parseInt(hslParts[0]);
			const s = parseInt(hslParts[1]);
			const l = parseInt(hslParts[2]);
			hslValue = `hsl(${h}, ${s}%, ${l}%)`;
		}
		hexValue = hslToHex(hslValue);
		updateFromHex();
	}

	function updateInputBackgrounds() {
		const hexInput = document.querySelector('.hex-input');
		const rgbInput = document.querySelector('.rgb-input');
		const hslInput = document.querySelector('.hsl-input');
		const colorSelect = document.querySelector('.color-select');
		const radioButtons = document.querySelectorAll('.radio-group input[type="radio"]');
		const header = document.querySelector('h1');
		if (hexValue && rgbValue) {
			const brightness = getBrightness(hexValue);
			const textColor = brightness > 128 ? 'white' : 'black';

			hexInput.style.backgroundColor = hexValue;
			hexInput.style.color = textColor;
			rgbInput.style.backgroundColor = hexValue;
			rgbInput.style.color = textColor;
			hslInput.style.backgroundColor = hexValue;
			hslInput.style.color = textColor;
			colorSelect.style.backgroundColor = hexValue;
			colorSelect.style.color = textColor;

			radioButtons.forEach((radio) => {
				radio.style.accentColor = hexValue;
			});

			if (brightness > 128) {
				header.style.backgroundColor = hexValue;
				header.style.color = 'black';
			} else {
				header.style.backgroundColor = '';
				header.style.color = hexValue;
			}
		} else {
			hexInput.style.backgroundColor = '';
			hexInput.style.color = '';
			rgbInput.style.backgroundColor = '';
			rgbInput.style.color = '';
			hslInput.style.backgroundColor = '';
			hslInput.style.color = '';
			colorSelect.style.backgroundColor = '';
			colorSelect.style.color = '';

			radioButtons.forEach((radio) => {
				radio.style.accentColor = '';
			});

			header.style.backgroundColor = '';
			header.style.color = 'SlateGray';
		}
	}

	function getIntensity(hex) {
		const [r, g, b] = hexToRgb(hex);
		return Math.round((r + g + b) / 3);
	}

	function getLightness(hex) {
		const [r, g, b] = hexToRgb(hex);
		const max = Math.max(r, g, b) / 255;
		const min = Math.min(r, g, b) / 255;
		return ((max + min) / 2).toFixed(2);
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

	/** @type {{ [key: string]: string[] }} */
	const colorGroups = {
		Red: [
			'IndianRed',
			'LightCoral',
			'Salmon',
			'DarkSalmon',
			'LightSalmon',
			'Crimson',
			'Red',
			'FireBrick',
			'DarkRed'
		],
		Pink: ['Pink', 'LightPink', 'HotPink', 'DeepPink', 'MediumVioletRed', 'PaleVioletRed'],
		Orange: ['LightSalmon', 'Coral', 'Tomato', 'OrangeRed', 'DarkOrange', 'Orange'],
		Yellow: [
			'Gold',
			'Yellow',
			'LightYellow',
			'LemonChiffon',
			'LightGoldenRodYellow',
			'PapayaWhip',
			'Moccasin',
			'PeachPuff',
			'PaleGoldenRod',
			'Khaki',
			'DarkKhaki'
		],
		Purple: [
			'Lavender',
			'Thistle',
			'Plum',
			'Violet',
			'Orchid',
			'Fuchsia',
			'Magenta',
			'MediumOrchid',
			'MediumPurple',
			'RebeccaPurple',
			'BlueViolet',
			'DarkViolet',
			'DarkOrchid',
			'DarkMagenta',
			'Purple',
			'Indigo',
			'SlateBlue',
			'DarkSlateBlue',
			'MediumSlateBlue'
		],
		Green: [
			'GreenYellow',
			'Chartreuse',
			'LawnGreen',
			'Lime',
			'LimeGreen',
			'PaleGreen',
			'LightGreen',
			'MediumSpringGreen',
			'SpringGreen',
			'MediumSeaGreen',
			'SeaGreen',
			'ForestGreen',
			'Green',
			'DarkGreen',
			'YellowGreen',
			'OliveDrab',
			'Olive',
			'DarkOliveGreen',
			'MediumAquaMarine',
			'DarkSeaGreen',
			'LightSeaGreen',
			'DarkCyan',
			'Teal'
		],
		Blue: [
			'Aqua',
			'Cyan',
			'LightCyan',
			'PaleTurquoise',
			'Aquamarine',
			'Turquoise',
			'MediumTurquoise',
			'DarkTurquoise',
			'CadetBlue',
			'SteelBlue',
			'LightSteelBlue',
			'PowderBlue',
			'LightBlue',
			'SkyBlue',
			'LightSkyBlue',
			'DeepSkyBlue',
			'DodgerBlue',
			'CornflowerBlue',
			'RoyalBlue',
			'Blue',
			'MediumBlue',
			'DarkBlue',
			'Navy',
			'MidnightBlue'
		],
		Brown: [
			'Cornsilk',
			'BlanchedAlmond',
			'Bisque',
			'NavajoWhite',
			'Wheat',
			'BurlyWood',
			'Tan',
			'RosyBrown',
			'SandyBrown',
			'GoldenRod',
			'DarkGoldenRod',
			'Peru',
			'Chocolate',
			'SaddleBrown',
			'Sienna',
			'Brown',
			'Maroon'
		],
		White: [
			'White',
			'Snow',
			'HoneyDew',
			'MintCream',
			'Azure',
			'AliceBlue',
			'GhostWhite',
			'WhiteSmoke',
			'SeaShell',
			'Beige',
			'OldLace',
			'FloralWhite',
			'Ivory',
			'AntiqueWhite',
			'Linen',
			'LavenderBlush',
			'MistyRose'
		],
		Gray: [
			'Gainsboro',
			'LightGray',
			'Silver',
			'DarkGray',
			'Gray',
			'DimGray',
			'LightSlateGray',
			'SlateGray',
			'DarkSlateGray',
			'Black'
		]
	};
</script>

<div class="outer">
	hexValue: ({hexValue}), rgbValue: ({rgbValue}), hslValue: ({hslValue}) hex->rgb->hex: ({rgbToHex(
		hexToRgb(hexValue)
	)}), hsl->rgb: ({hslToRgb(hslValue)})

	<h1>Color Code Converter</h1>

	<div class="container">
		<div class="radio-group">
			<label>
				<input
					type="radio"
					bind:group={selectionMode}
					value="name"
					onchange={updateInputBackgrounds}
				/>
				Select Color by Name
			</label>
			<label>
				<input
					type="radio"
					bind:group={selectionMode}
					value="group"
					onchange={updateInputBackgrounds}
				/>
				Select Color by Color Group and Name
			</label>
		</div>

		<div class="controls">
			{#if selectionMode === 'name'}
				<select bind:value={selectedColor} onchange={updateValues} class="color-select">
					{#if selectedColor === 'not a named color'}
						<option value="Not a named color">Not a named color</option>
					{:else}
						<option value="">Select Color</option>
					{/if}
					{#each Object.keys(namedColors) as color}
						<option value={color} style="background-color: {namedColors[color]};">{color}</option>
					{/each}
				</select>
			{:else}
				<select bind:value={selectedColor} onchange={updateValues} class="color-select">
					{#if selectedColor === 'not a named color'}
						<option value="Not a named color">Not a named color</option>
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

			<div>
				#
				<input
					type="text"
					bind:value={hexValue}
					oninput={updateFromHex}
					placeholder="bada55"
					class="input-box hex-input"
				/>
			</div>
			<div>
				rgb(
				<input
					type="text"
					bind:value={rgbValue}
					oninput={updateFromRgb}
					placeholder="45,67,89"
					class="input-box rgb-input"
				/> )
			</div>
			<div>
				hsl(
				<input
					type="text"
					bind:value={hslValue}
					oninput={updateFromHsl}
					placeholder="HSL value"
					class="input-box hsl-input"
				/> )
			</div>
		</div>
	</div>
</div>

<style>
	.outer {
		background-color: white;
		width: 100%;
		min-height: 100vh;
		overflow-y: auto;
		padding: 1rem;
	}
	h1 {
		border-radius: 0.25rem;
		font-family: 'AlkesLightIt';
		margin-inline: auto;
		padding: 0.5rem;
		text-align: center;
		transition:
			background-color 0.3s,
			color 0.3s;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: white;
	}

	.radio-group {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.radio-group label {
		padding: 0.5rem;
		border-radius: 0.25rem;
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.color-select {
		width: 12rem;
		padding: 0.5rem;
		border: 1px solid #999;
		border-radius: 4px;
	}

	.input-box {
		width: 12rem;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	select {
		padding: 0 1em 0 0;
		margin: 0;
		outline: none;
		font-family: inherit;
		font-size: inherit;
		cursor: inherit;
		line-height: inherit;
	}
</style>
