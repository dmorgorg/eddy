<script>
	// @ts-nocheck

	

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


</script>

<div class="outer">
	<div class="container">


    	<div class="controls">


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



	

	
</style>
