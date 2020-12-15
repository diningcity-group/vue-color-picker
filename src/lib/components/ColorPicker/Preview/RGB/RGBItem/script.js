import { Input } from "@/lib/components/UI";

export default {
    name: "RGBItem",

    props: {
        value: String | Number,
        type: String,
        label: String,
        suffix: String,
        max: Number,
        onChange: Function,
    },

    components: {
        Input
    },

    data() {
        return {
            inputValue: this.suffix ? this.value + this.suffix : this.value,
            inProgress: false
        }
    },

    watch: {
        value: "setValue"
    },

    methods: {
        onChangeHandler(event) {
            const value = +event.target.value;

            if (Number.isNaN(value) || value.length > 3 || value < 0 || value > 255 || (this.max && value > this.max)) {
                this.inputValue = this.value;

                this.$forceUpdate();

                return;
            }

            this.inputValue = event.target.value;

            this.onChange(value);
        },

        onFocus() {
            this.inProgress = true
            if(this.suffix) {
                this.inputValue = String(this.inputValue).replace(new RegExp(this.suffix), '')
            }
        },

        onBlur() {
            if (!this.inputValue && !this.inputValue !== 0) {
                this.inputValue = this.value;
            }

            if(this.suffix) {
                this.inputValue += this.suffix
            }

            this.inProgress = false;
        },

        setValue() {
            if (this.value !== +this.inputValue && this.inputValue !== '') {
                this.inputValue = this.value;
            }
            if(this.suffix && this.inProgress === false) {
                this.inputValue += this.suffix
            }
        }
    }
};
