<template>
    <div class="error-page">
        <h1>錯誤</h1>
        <p>{{ message }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const message = computed(() => {
    return route.params.message || '發生了未知錯誤。';
});
</script>

<script>
</script>