import Hex from './Hex';
import RGB from './RGB';

export default {
    name: "Preview",

    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        points: Array,
        updateColor: Function,
    },

    components: {
        Hex,
        RGB,
    },

    data() {
        return {
            colorMode: 'Hex',
            colorOptions: [
                {value: 'Hex', label: 'Hex'},
                {value: 'RGB', label: 'RGB'},
            ],
        }
    }
};
