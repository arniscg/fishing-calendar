let colors: string[] = [
    "#EB4A4A",
    "#56509F",
    "#00821D",
    "#FFD600",
    "#BE1098",
    "#369AA0",
    "#00113C",
    "#713D3D"
];

let usedColors: string[] = [];

export function getColor() {
    const color = colors.shift();

    if (color) {
        usedColors.push(color);
        return color;
    }

    colors = usedColors;
    usedColors = [];
};