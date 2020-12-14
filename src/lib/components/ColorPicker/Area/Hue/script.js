import { getHue } from "@/lib/helpers";
import { useMouseEvents } from "@/lib/hooks";

export default {
    name: "hue",

    props: {
        hue: Number,
        saturation: Number,
        value: Number,
        updateColor: Function,
    },

    data() {
        return {
            height: 0,
            mouseEvents: () => {},
        }
    },

    mounted() {
        const { hueRef } = this.$refs;

        if (hueRef) {
            this.height = hueRef.clientHeight;
        }

        this.mouseEvents = useMouseEvents(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },

    computed: {
        offsetTop() {
            return ((this.hue * this.height / 360) | 0) - 6;
        },

        pointerStyle() {
            return {
                top: `${this.offsetTop}px`,
            }
        },
    },

    methods: {
        mouseDownHandler(event) {
            const elementY = event.currentTarget.getBoundingClientRect().y;
            const startY = event.pageY;
            const positionY = startY - elementY;

            const color = getHue(positionY, this.height, this.saturation, this.value);

            this.updateColor(color, 'onStartChange');

            return {
                startY,
                positionY,
            };
        },

        changeObjectPositions(event, { startY, positionY }) {
            const moveY = event.pageY - startY;
            positionY += moveY;

            // update value and saturation
            const offsetY = positionY > this.height ? this.height : positionY <= 0 ? 0 : positionY;
            const color = getHue(offsetY, this.height, this.saturation, this.value);

            return {
                positions: {
                    positionY,
                    startY: event.pageY,
                },
                color,
            };
        },

        mouseMoveHandler(event, { startY, positionY }) {
            const { positions, color } = this.changeObjectPositions(event, { startY, positionY });

            this.updateColor(color, 'onChange');

            return positions;
        },

        mouseUpHandler(event, { startY, positionY, }) {
            const { positions, color } = this.changeObjectPositions(event, { startY, positionY });

            this.updateColor(color, 'onEndChange');

            return positions;
        },
    }
}
