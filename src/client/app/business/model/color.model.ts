export class Color {
    red: number;
    green: number;
    blue: number;
    hex: string;


    constructor(red: number, green: number, blue: number, hex: string) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.hex = hex;

        if (this.hex === null) {
            this.convertRGBtoHex();
        } else {
            let component = this.convertHexToRGB(this.hex);
            if (component !== null) {
                this.red = component.r;
                this.green = component.g;
                this.blue = component.b;
            }
        }
    }

    getRGB() {
        return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
    }

    getHexValue() {
        return this.hex;
    }

    convertComponentToHex(c: number) {
        //see http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        let hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    convertRGBtoHex() {
        //see http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        this.hex = '#' + this.convertComponentToHex(this.red) + this.convertComponentToHex(this.green)
            + this.convertComponentToHex(this.blue);
    }

    convertHexToRGB(hex: string) {
        //see http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}
