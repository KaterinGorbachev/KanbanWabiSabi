<template>
  <section
    class="flex flex-col gap-[2rem] bg-[url('/background.jpg')] bg-cover bg-no-repeat bg-[#FAE8B4] p-[3rem] min-h-screen w-full"
  >
    <header class="sticky top-0 z-50 py-2 flex flex-row justify-between">
      <router-link to="/" class="flex flex-row gap-2 items-center justify-center"
        ><div
          class="w-[50px] h-[50px] rounded-[50%] border-2 border-[#fff] bg-[url('/N_night-view.svg')] bg-contain bg-no-repeat bg-center bg-[#693c00]"
        ></div>
        <p class="text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block">
          Ir a Managment Board
        </p>
      </router-link>
      <div class="flex gap-2 items-center justify-center flex-row">
        <label
          for="logout"
          class="text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block cursor-pointer"
        >
          Log out
        </label>
        <ButtonBasic
          id="logout"
          @onclick="userLogout"
          classes="w-[40px] h-[40px] rounded-[50%] border-2 border-[#cc5c00c7] bg-[url('/P_tomb-emperor-nintoku.svg')] bg-center bg-no-repeat bg-center bg-cover cursor-pointer bg-amber-50"
        />
      </div>
    </header>

    <main class="flex flex-col justify-between gap-4 w-full items-start">
      <!-- Color Filter -->
      <div class="flex flex-col justify-between gap-1">
        <div class="flex flex-col w-full items-end fixed top-40 right-4 z-40 p-4">
          <div class="flex gap-2 items-center justify-center relative p-4">
            <label
              for="color-filter"
              class="cursor-pointer text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block"
            >
              Filtrar
            </label>
            <button
              id="color-filter"
              class="w-[30px] h-[30px] rounded-[50%] border-2 border-[#7D2E00] bg-no-repeat bg-center bg-contain cursor-pointer transition hover:bg-emerald-300 hover:border-emerald-300"
              :style="{ backgroundColor: selectedColorFilter || '#7D2E00' }"
              @click="colorFilterVisible = !colorFilterVisible"
            ></button>
          </div>
          <div
            v-if="colorFilterVisible"
            class="mt-2 bg-amber-50 border border-amber-800 rounded-md shadow-md absolute right-0 top-15 p-4"
          >
            <p class="text-amber-900 font-medium mb-3">Filtrar por color:</p>
            <input
              type="color"
              value="#7D2E00"
              v-model="selectedColorFilter"
              class="w-full h-10 rounded-md cursor-pointer"
              list="filter-colors"
            />
            <datalist id="filter-colors">
              <option value="#FFFBEB" />
              <option value="#FDE68A" />
              <option value="#FBCFE8" />
              <option value="#DCFCE7" />
              <option value="#bddde9" />
            </datalist>
            <button
              v-if="selectedColorFilter"
              @click="selectedColorFilter = ''"
              class="mt-3 w-full text-xs px-2 py-2 rounded-md border border-amber-800 bg-transparent hover:bg-amber-100 text-amber-900 transition"
            >
              Limpiar filtro
            </button>
          </div>
        </div>

        <h1
          class="text-xl sm:text-3xl text-amber-950 text-shadow-emerald-950 font-[Zen_Maru_Gothic] font-bold"
        >
          Wabi Sabi Board
        </h1>
        <h2 class="text-white text-shadow-emerald-950 text-[16px] sm:text-xl font-bold">
          ¡Bienvinido de nuevo, {{ usuario?.email }}!
        </h2>
        <p class="text-white text-shadow-emerald-950 text-[14px] sm:text-md">
          Fluye en equilibrio con el río del tiempo y disfruta de tu trabajo; no dejes que las
          imperfecciones te perturben.
        </p>
      </div>

      <p
        v-if="myKanban.length == 0 || filteredKanban.length == 0"
        class="text-white text-shadow-emerald-950 text-[1rem] sm:text-lg font-bold"
      >
        No tienes las tareas...
      </p>
      <div class="flex flex-wrap gap-[2rem] w-full pe-9">
        <div
          class="flex md:w-[30%] lg:w-[20%] w-full "
          v-for="task in filteredKanban"
          :key="task.id"
        >
          <TaskCard
            :id="task.id"
            :text="task.text"
            :completed="task.completed"
            :asigned="false"
            :mytask="true"
            :currentColor="task.backgroundColor || '#FFFBEB'"
            :card-color="
              task.completed
                ? 'bg-rose-50/70 border-rose-200/50'
                : task.backgroundColor || 'bg-white/90 border-amber-200/50'
            "
            @color-change="handleColorChange"
          />
        </div>
      </div>
    </main>
  </section>
</template>

<script setup>
import { usuario } from '@/services/authFirebase'
import {
  obtenerPerfilUsuario,
  updateTaskColor,
  updateTaskCompletedStatus,
} from '@/services/workspaceData'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TaskCard from '@/components/TaskCard.vue'
import { ref, watch, computed } from 'vue'
import { logout } from '@/services/authFirebase'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
let myKanban = ref({})
let colorFilterVisible = ref(false)
let selectedColorFilter = ref('')

// Computed property to filter tasks by selected color
const filteredKanban = computed(() => {
  if (!selectedColorFilter.value) {
    return myKanban.value
  }
  return myKanban.value.filter(
    (task) =>
      (task.backgroundColor || '#FFFBEB').toLowerCase() === selectedColorFilter.value.toLowerCase(),
  )
})

// Handle color change from TaskCard
const handleColorChange = async (taskId, newColor) => {
  try {
    // 1. Update local state immediately (optimistic update)
    const task = myKanban.value.find((t) => t.id === taskId)
    if (task) {
      task.backgroundColor = newColor
    }

    // 2. Persist to database
    await updateTaskColor(usuario.value.uid, 'tareas', taskId, newColor)
    //toast.success('Color updated successfully', { timeout: 1500 })
  } catch (error) {
    // Revert on error
    console.error('Failed to update color:', error)
    toast.error('Failed to update color')
    // Reload tasks to sync with server
    await getKanban()
  }
}

const completedTask = async (taskId) => {
  try {
    const task = myKanban.value.find((t) => t.id === taskId)
    if (task) {
      task.completed = true
    }
    // Optionally, persist this change to the database if needed
    await updateTaskCompletedStatus(usuario.value.uid, 'tareas', taskId, true, false)
    toast.success('Tarea marcada como completada', { timeout: 1500 })
  } catch (error) {
    console.error('Failed to complete task:', error)
    toast.error('Failed to complete task')
    await getKanban()
  }
}

const userLogout = async () => {
  let result = await logout()
  if (result.ok) {
    router.push('/')
  } else {
    toast.error(result.mensaje, { timeout: false })
  }
}

const getKanban = async () => {
  let result = await obtenerPerfilUsuario(usuario.value.uid, 'tareas')
  if (result.ok) {
    myKanban.value = result.perfil.tareasAsigned
    //console.log(myKanban.value)
  } else {
    toast.error(result.mensaje, { timeout: false })
  }
}

watch(
  usuario,
  (newUsuario) => {
    if (newUsuario?.uid) {
      getKanban(newUsuario.uid)
    }
  },
  { immediate: true },
)
</script>

<style></style>
