import { Input } from "@/lib/components/UI";

import { rgbToHex, hexToRgb } from "@/lib/helpers";

export default {
    name: "Preview",

    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        max: Number,
        updateColor: Function,
    },

    components: {
        Input
    },

    data() {
        return {
            inProgress: false,
            hexValue: '#' + rgbToHex(this.red, this.green, this.blue),
            alphaValue: this.toPercent(this.alpha)
        }
    },

    computed: {
        hex() {
            return rgbToHex(this.red, this.green, this.blue)
        }
    },

    watch: {
        inProgress: "setHex",
        red: "setHex",
        green: "setHex",
        blue: "setHex",
        alpha: "setAlpha",
    },

    methods: {
        toPercent(value) {
            return (parseInt(value * 100, 10) || 100) + '%'
        },

        toFloat(num) {
            return Number((parseInt(num, 10) / 100).toFixed(2))
        },

        setHex() {
            if (this.inProgress) {
                return;
            }

            this.hexValue = '#' + this.hex;
        },

        setAlpha() {
            this.alphaValue = this.toPercent(this.alpha)
        },

        changeHex(event) {
            const color = hexToRgb(event.target.value);

            if (color) {
                this.updateColor({
                    ...color, 
                    alpha: this.toFloat(this.alphaValue)
                });
            }
        },

        onFocus() {
            this.inProgress = true
            this.alphaValue = parseInt(this.alphaValue, 10)
        },

        onBlur() {
            this.inProgress = false
            this.updateColor({
                alpha: this.toFloat(this.alphaValue)
            });
            this.alphaValue = parseInt(this.alphaValue, 10) + '%'
        },

        changeAlpha(event) {
            const value = +event.target.value;
            if (Number.isNaN(value) || value.length > 3 || value < 0 || value > 255 || (this.max && (value > this.max))) {
                this.alphaValue = 100
                return;
            }
            this.alphaValue = value;
        }
    }
};
