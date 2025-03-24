function color() {
    return {
        validHex: function (hex) {
            if (typeof hex !== "string" || !/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
                return false;
            }
            return true;
        },

        hexToRgb: function (hex) {
            if (!this.validHex(hex)) return console.error("Invalid Hex Code") || null;
            hex = hex.replace(/^#/, "");
            if (hex.length === 3) hex = hex.split("").map(x => x + x).join("");
            let bigint = parseInt(hex, 16);
            return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
        },

        rgbToHsl: function (r, g, b) {
            if ([r, g, b].some(v => v < 0 || v > 255)) return console.error("Invalid Values") || null;
            r /= 255, g /= 255, b /= 255;
            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) h = s = 0;
            else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                h = (max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60;
            }
            return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
        },

        hexToHsl: function (hex) {
            if (!this.validHex(hex)) return console.error("Invalid Hex Code") || null;
            return this.rgbToHsl(...this.hexToRgb(hex));
        },

        hexToHue: function (hex) { return this.hexToHsl(hex)?.[0] ?? null; },
        hexToSat: function (hex) { return this.hexToHsl(hex)?.[1] ?? null; },
        hexToLum: function (hex) { return this.hexToHsl(hex)?.[2] ?? null; },

        hslToRgb: function (h, s, l) {
            if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return console.error("Invalid Values") || null;
            s /= 100, l /= 100;
            let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
            let [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
            return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
        },

        rgbToHex: function (r, g, b) {
            if ([r, g, b].some(v => v < 0 || v > 255)) return console.error("Invalid Values") || null;
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        },

        hslToHex: function (h, s, l) {
            if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return console.error("Invalid Values") || null;
            return this.rgbToHex(...this.hslToRgb(h, s, l));
        },

        relLum: function (hex) {
            let [r, g, b] = this.hexToRgb(hex)?.map(v => {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            }) ?? [0, 0, 0]; // Default to black if invalid input
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        },

        contrastRatio: function (hex1, hex2) {
            if (!this.validHex(hex1) || !this.validHex(hex2)) return console.error("Invalid Values") || null;
            let lum1 = this.relLum(hex1), lum2 = this.relLum(hex2);
            return Number(((Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)).toFixed(2));
        },

        contrastRating: function (hex1, hex2) {
            if (!this.validHex(hex1) || !this.validHex(hex2)) return console.error("Invalid Values") || null;
            let ratio = this.contrastRatio(hex1, hex2);
            return ratio < 3 ? "Fail" : ratio < 4.5 ? "AA Large (Minimum)" : ratio < 7 ? "AA Small (Good)" : "AAA 🌟";
        }
    };
}

const c = color();

