<script>
	import { onMount } from 'svelte';

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

	let selectedColor = '';
	let hexValue = '';
	let rgbValue = '';
	let selectionMode = 'name'; // 'name' or 'group'

	/**
	 * @param {string} hex
	 */
	function hexToRgb(hex) {
		let bigint = parseInt(hex.slice(1), 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;
		return `rgb(${r}, ${g}, ${b})`;
	}

	/**
	 * @param {string} rgb
	 */
	function rgbToHex(rgb) {
		let result = rgb.match(/\d+/g);
		if (!result || result.length < 3) {
			return '#000000';
		}
		return `#${((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1).toUpperCase()}`;
	}

	function updateValues() {
		if (namedColors[selectedColor]) {
			hexValue = namedColors[selectedColor];
			rgbValue = hexToRgb(hexValue);
		} else {
			selectedColor = 'not a named color';
			hexValue = '';
			rgbValue = '';
		}
	}

	function updateFromHex() {
		let colorName = Object.keys(namedColors).find(
			(key) => namedColors[key].toUpperCase() === hexValue.toUpperCase()
		);
		if (colorName) {
			selectedColor = colorName;
			rgbValue = hexToRgb(hexValue);
		} else {
			selectedColor = 'not a named color';
			rgbValue = hexToRgb(hexValue);
		}
	}

	function updateFromRgb() {
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
	<h1>Color Code Converter</h1>

	<div class="container">
		<div class="radio-group">
			<label>
				<input type="radio" bind:group={selectionMode} value="name" />
				Select Color by Name
			</label>
			<label>
				<input type="radio" bind:group={selectionMode} value="group" />
				Select Color by Color Group and Name
			</label>
		</div>

		<div class="controls">
			{#if selectionMode === 'name'}
				<select bind:value={selectedColor} on:change={updateValues} class="color-select">
					{#if selectedColor === 'not a named color'}
						<option value="not a named color">Not a named color</option>
					{:else}
						<option value="">Select Color</option>
					{/if}
					{#each Object.keys(namedColors) as color}
						<option value={color} style="background-color: {namedColors[color]};">{color}</option>
					{/each}
				</select>
			{:else}
				<select bind:value={selectedColor} on:change={updateValues} class="color-select">
					{#if selectedColor === 'not a named color'}
						<option value="not a named color">Not a named color</option>
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

			<input
				type="text"
				bind:value={hexValue}
				on:input={updateFromHex}
				placeholder="Hex value"
				class="input-box"
			/>
			<input
				type="text"
				bind:value={rgbValue}
				on:input={updateFromRgb}
				placeholder="RGB value"
				class="input-box"
			/>
		</div>
	</div>
</div>

<style>
	.outer {
		background-color: red;
		width: 100%;
		min-height: 100vh;
		overflow-y: auto;
		padding: 1rem;
	}
	h1 {
		margin-inline: auto;
		margin-block-start: 1rem;
		text-align: center;
		border: 1px solid black;
		padding: 0.5rem;
		background-color: #f0f0f0;
		border-radius: 8px;
		color: 'SlateGray';
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.radio-group {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.controls {
		display: flex;
		gap: 1rem;
	}

	.color-select {
		width: 200px;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.input-box {
		width: 200px;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	option:hover {
		font-weight: bold;
		background-color: inherit;
	}
</style>
