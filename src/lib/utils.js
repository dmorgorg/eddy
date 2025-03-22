import katex from 'katex';

export const ki = (/** @type {string} */ tex) => {
	return katex.renderToString(tex);
};
export const kd = (/** @type {string} */ tex) => {
	return katex.renderToString(tex, { displayMode: true });
};
