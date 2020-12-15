<template>
<fragment>
    <RGBItem
        :value="red"
        type="number"
        :onChange="value => changeValue('red', value)"
    />
    <RGBItem
        :value="green"
        type="number"
        :onChange="value => changeValue('green', value)"
    />
    <RGBItem
        :value="blue"
        type="number"
        :onChange="value => changeValue('blue', value)"
    />
    <RGBItem
        :value="parseInt(alpha * 100, 10)"
        type="number"
        suffix="%"
        :max="100"
        class="alpha-input"
        :onChange="value => changeValue('alpha', value)"
    />
</fragment>
</template>

<script src="./script.js" />

<style scoped>

</style>
