<template>
    <Input
        :value="inputValue"
        :type="type"
        :label="label"
        @input="onChangeHandler"
        :onFocus="onFocus"
        :onBlur="onBlur"
        :inProgress="inProgress"
        classes="rgb"
    />
</template>

<script src="./script.js" />

<style scoped>

</style>
