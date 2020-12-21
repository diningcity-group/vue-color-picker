<template>
    <div :class="`input-field ${classes}`">
        <div class="input-container">
            <input
                :class="`${type}-input input`"
                @focus="onFocus"
                @blur="onBlur"
                :value="value"
                @input="$emit('input', $event)"
                @keyup.enter="onBlur"
            />
        </div>
        <div class="label" v-if="label">
            {{label}}
        </div>
    </div>
</template>

<script src="./script.js" />

<style src="./index.less" lang="less" />
