<template>
  <div
    :id="id"
    :class="[
      'relative rounded-xl px-7 py-4 backdrop-blur-md border',
      'transition w-full ',
      !mytask ? cardColor : 'border-amber-200/50',
    ]"
    :style="mytask && currentColor ? { backgroundColor: currentColor, opacity: '0.9' } : {}"
  >
    <div v-if="mytask">
      <input
        type="color"
        class="absolute top-2 right-2 w-6 h-6 cursor-pointer opacity-70 hover:opacity-100"
        :value="currentColor"
        @input="onColorInput"
        list="zen-colors"
      />
      <datalist id="zen-colors">
        <option value="#FFFBEB" />
        <option value="#FDE68A" />
        <option value="#FBCFE8" />
        <option value="#DCFCE7" />
        <option value="#bddde9" />
      </datalist>
    </div>

    <p
      :class="[
        'text-sm font-medium tracking-wide mb-3 me-1',
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
    <div v-else-if="mytask" class="flex items-center gap-2 text-xs uppercase tracking-widest">
      <!-- <button @click="emit('complete', props.id)" class="text-xs px-3 py-2 rounded-md border transition cursor-pointer  border-amber-800 hover:bg-amber-300/50">completada</button> -->
    </div>
    <div v-else-if="asigned" class="flex items-center gap-2 text-xs uppercase tracking-widest">
      <p class="text-green-900">asignada</p>
      <i class="fa-solid fa-user text-green-900"></i>
    </div>
    <div v-else class="flex flex-col items-start justify-evenly gap-2">
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
  currentColor: { type: String, default: '#FFFBEB' },
})

const emit = defineEmits(['get', 'color-change', 'complete'])
const onColorInput = (e) => {
  emit('color-change', props.id, e.target.value)
}
</script>

<style></style>
