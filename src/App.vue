<template>
  <div id="app">
    <div class="picker-dialog">
      <ColorPicker
          :color="color"
          :onStartChange="color => onChange(color, 'start')"
          :onChange="color => onChange(color, 'change')"
          :onEndChange="color => onChange(color, 'end')"
      />
    </div>
    <h2>demo</h2>
    <div class="demo" :style="style"></div>
  </div>
</template>

<script>
import { ColorPicker } from './lib'

export default {
  name: 'App',
  components: {
    ColorPicker
  },

  data() {
    return {
      color: {
        red: 255,
        green: 0,
        blue: 0,
        alpha: 1
      }
    };
  },

  computed: {
    style() {
      return `background: ${this.color.style}`
    }
  },

  methods: {
    onChange(attrs) {
      this.color = { ...attrs };
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}
.picker-dialog {
  width: 254px;
  box-sizing: border-box;
}
.demo {
  margin: 20px;
  border: 1px solid #e6e6e6;
  width: 100px;
  height: 100px;
}
</style>
