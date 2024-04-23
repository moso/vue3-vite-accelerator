<script lang="ts" setup>
    const data = [
        {
            id: 1,
            text: 'This is a list',
        },
        {
            id: 2,
            text: 'which is rendered',
        },
        {
            id: 3,
            text: 'by a component',
        }
    ];
</script>

<template>
    <div class="card">
        <slot />

        <ul class="list">
            <li v-for="(item, index) in data" :key="index">{{ item.text }}</li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    @import '../styles/variables';

    .card {
        padding: 2rem;
        background-color: #fff;
        border-radius: $border-radius;
        box-shadow: $box-shadow;
    }
</style>
