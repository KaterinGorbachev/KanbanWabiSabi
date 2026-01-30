<template>
  <button @click="emit('onclick')">{{ label }}</button>
</template>

<script setup>
defineProps(
  {
    label: String,

  }
)

const emit = defineEmits(['onclick'])

</script>

<style>

</style>
