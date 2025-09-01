var eduk8r = eduk8r || {};
eduk8r.utils = eduk8r.utils || {};

eduk8r.utils.Utils = (function () {

    // takes a hex number as color and returns white for 0 percent and color for 100 percent
    var white2colorShader = function (color, percent) {
        var r, g, b,
            percent = percent < 0 ? 0 : percent > 100 ? 100 : percent,
            color = color.toString()

        if (color[0] === '#') {
            color = color.replace(/#/, '');
        }
        if (color.length === 5) {
            color = '0' + color;
        } else if (color.length < 5) {
            alert("invalid hex number passed to white2colorShader()");
        }
        // make r, g, b decimal
        r = parseInt(color.substring(0, 2), 16);
        g = parseInt(color.substring(2, 4), 16);
        b = parseInt(color.substring(4, 6), 16);

        // get new values
        r = 255 - percent * (255 - r) / 100 | 0;
        g = 255 - percent * (255 - g) / 100 | 0;
        b = 255 - percent * (255 - b) / 100 | 0;

        // make them hex again and pad
        r = (r.toString(16).length === 1) ? '0' + r.toString(16) : r.toString(16);
        g = (g.toString(16).length === 1) ? '0' + g.toString(16) : g.toString(16);
        b = (b.toString(16).length === 1) ? '0' + b.toString(16) : b.toString(16);

        return '#' + r + g + b;

    }

    // takes a hex number as color and returns color for 0 percent and black for 100 percent
    var color2blackShader = function (color, percent) {
        var r, g, b,
            percent = percent < 0 ? 0 : percent > 100 ? 100 : percent,
            color = color.toString()

        if (color[0] === '#') {
            color = color.replace(/#/, '');
        }
        if (color.length === 5) {
            color = '0' + color;
        } else if (color.length < 5) {
            alert("invalid hex number passed to white2colorShader()");
        }
        // make r, g, b decimal
        r = parseInt(color.substring(0, 2), 16);
        g = parseInt(color.substring(2, 4), 16);
        b = parseInt(color.substring(4, 6), 16);
        // get new values
        r = (100 - percent) * r / 100 | 0;
        g = (100 - percent) * g / 100 | 0;
        b = (100 - percent) * g / 100 | 0;

        // make them hex again and pad
        r = (r.toString(16).length === 1) ? '0' + r.toString(16) : r.toString(16);
        g = (g.toString(16).length === 1) ? '0' + g.toString(16) : g.toString(16);
        b = (b.toString(16).length === 1) ? '0' + b.toString(16) : b.toString(16);

        return '#' + r + g + b;
    }

    return {
        white2colorShader: white2colorShader,
        color2blackShader: color2blackShader
    };

}());