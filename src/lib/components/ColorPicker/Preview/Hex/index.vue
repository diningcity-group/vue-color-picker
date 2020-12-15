<template>
    <fragment>
        <Input
            :value="hexValue"
            @input="changeHex"
            :onFocus="() => inProgress = true"
            :onBlur="() => inProgress = false"
            :inProgress="inProgress"
            classes="hex"
        />
        <Input
            :value="alphaValue"
            type="number"
            style="width: 50px"
            :max="100"
            :onFocus="onFocus"
            :onBlur="onBlur"
            :inProgress="inProgress"
            @input="changeAlpha"
        />
    </fragment>
</template>

<script src="./script.js" />
