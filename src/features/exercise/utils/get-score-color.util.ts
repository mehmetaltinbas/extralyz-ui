function hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) return [0, 0, l];

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;

    return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
    h = ((h % 360) + 360) % 360;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }

    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getScoreColor(score: number, isDark?: boolean): string {
    const clamped = Math.max(0, Math.min(100, score));
    const t = clamped / 100;

    const [h0, s0, l0] = hexToHsl('#9B1B30');
    const [h1, s1, l1] = hexToHsl('#2D8B45');

    // Normalize low hue to negative so interpolation goes red → orange → yellow → green
    const startHue = h0 > 180 ? h0 - 360 : h0;
    const endHue = h1;

    const h = startHue + (endHue - startHue) * t;
    const s = s0 + (s1 - s0) * t;
    let l = l0 + (l1 - l0) * t;

    if (isDark) {
        l = Math.max(l, 0.55);
    }

    return hslToHex(h, s, l);
}
