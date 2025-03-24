function color() {
    return {
        hexToRgb: function (hex) {
            hex = hex.replace(/^#/, "");
            if (hex.length === 3) {
                hex = hex.split("").map(x => x + x).join("");
            }
            let bigint = parseInt(hex, 16);
            return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
        },

        rgbToHsl: function (r, g, b) {
            r /= 255, g /= 255, b /= 255;
            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0; // achromatic
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h = Math.round(h * 60);
            }
            return [h, Math.round(s * 100), Math.round(l * 100)];
        },

        hexToHsl: function (hex) {
            let [r, g, b] = this.hexToRgb(hex);
            return this.rgbToHsl(r, g, b);
        },

        hexToHue: function (hex) {
            return this.hexToHsl(hex)[0];
        },

        hexToSat: function (hex) {
            return this.hexToHsl(hex)[1];
        },

        hexToLum: function (hex) {
            return this.hexToHsl(hex)[2];
        },

        hslToRgb: function (h, s, l) {
            s /= 100;
            l /= 100;
            let c = (1 - Math.abs(2 * l - 1)) * s;
            let x = c * (1 - Math.abs((h / 60) % 2 - 1));
            let m = l - c / 2;
            let r = 0, g = 0, b = 0;

            if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
            else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
            else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
            else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
            else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
            else if (h >= 300 && h < 360) [r, g, b] = [c, 0, x];

            return [
                Math.round((r + m) * 255),
                Math.round((g + m) * 255),
                Math.round((b + m) * 255)
            ];
        },

        rgbToHex: function (r, g, b) {
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        },

        hslToHex: function (h, s, l) {
            return this.rgbToHex(...this.hslToRgb(h, s, l));
        }
    };
}

// Usage
console.log(color().hexToHsl("#004433")); // [162, 100, 13]
console.log(color().hexToHue("#004433")); // 162
console.log(color().hexToSat("#004433")); // 100
console.log(color().hexToLum("#004433")); // 13
console.log(color().hslToHex(162, 100, 13)); // "#004433"
