<template>
  <div :id="id"
        :class="[
      'relative rounded-xl p-4 backdrop-blur-md border',
      'shadow-sm hover:shadow-md transition w-full lg:w-[20%] md:w-[30%]',
      cardColor
    ]">
    <p class="text-sm font-medium tracking-wide mb-3">{{ text }}</p>

    <div v-if="completed" class="flex items-center gap-2 text-xs uppercase tracking-widest">
      <p>completada</p>
      <i class="fa-solid fa-flag-checkered"></i>
    </div>
     <div v-else-if="mytask" class="flex items-center gap-2 text-xs uppercase tracking-widest">

    </div>
    <div v-else-if="asigned" class="flex items-center gap-2 text-xs uppercase tracking-widest">
      <p>asignada</p>
      <i class="fa-solid fa-user"></i>
    </div>
    <div v-else class="flex items-center justify-between">
      <p class="text-xs uppercase tracking-widest opacity-70">pendente</p>
      <button @click="emit('get', props)" class="text-xs px-3 py-2 rounded-md
               bg-green-200/50
               hover:bg-orange-200/50 transition cursor-pointer">comprometerse</button>
    </div>
  </div>

</template>

<script setup>
const props = defineProps({
                id:Number,
                completed: {type: Boolean, default: false},
                asigned: {type: Boolean, default: false},
                mytask: Boolean,
                text: String,
                cardColor: {type: String, default: ''}

              })

const emit = defineEmits(['get'])


</script>

<style>

</style>
