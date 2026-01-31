<template>
  <button @click="emit('onclick')" :class="classes">{{ label }}</button>
</template>

<script setup>
defineProps({
  label: String,
  classes: String,
})

const emit = defineEmits(['onclick'])
</script>

<style></style>
