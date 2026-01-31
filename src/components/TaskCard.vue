<template>
  <div
    :id="id"
    :class="[
      'relative rounded-xl p-4 backdrop-blur-md border',
      'transition w-full lg:w-[20%] md:w-[30%]',
      cardColor,
    ]"
  >
    <p
      :class="[
        'text-sm font-medium tracking-wide mb-3',
        completed
          ? 'text-gray-600'
          : asigned
            ? 'text-green-900'
            : mytask
              ? 'text-amber-900'
              : 'text-amber-900',
      ]"
    >
      {{ text }}
    </p>

    <div v-if="completed" class="flex items-center gap-2 text-xs uppercase tracking-widest">
      <p class="text-gray-600">completada</p>
      <i class="fa-solid fa-flag-checkered text-gray-600"></i>
    </div>
    <div v-else-if="mytask" class="flex items-center gap-2 text-xs uppercase tracking-widest"></div>
    <div v-else-if="asigned" class="flex items-center gap-2 text-xs uppercase tracking-widest">
      <p class="text-green-900">asignada</p>
      <i class="fa-solid fa-user text-green-900"></i>
    </div>
    <div v-else class="flex items-center justify-between">
      <p class="text-xs uppercase tracking-widest opacity-70">pendiente</p>
      <button
        @click="emit('get', props)"
        :disabled="disable"
        class="text-xs px-3 py-2 rounded-md transition cursor-pointer"
        :class="disable ? 'bg-transparent text-grey-500' : 'bg-green-200/50 hover:bg-orange-200/50'"
      >
        comprometerse
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: Number,
  completed: { type: Boolean, default: false },
  asigned: { type: Boolean, default: false },
  mytask: Boolean,
  text: String,
  cardColor: { type: String, default: '' },
  disable: { type: Boolean, default: false },
})

const emit = defineEmits(['get'])
</script>

<style></style>
