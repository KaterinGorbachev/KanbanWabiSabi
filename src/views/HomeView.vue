<template>
  <section
    class="flex flex-col gap-[2rem] bg-[url('/background.jpg')] bg-cover bg-no-repeat bg-[#FAE8B4] py-[3rem] px-[2rem] min-h-screen w-full"
  >
    <header class="fixed right-0 top-6 left-0 z-50 p-9 w-full flex items-center justify-between">
      <h1 class="text-xl sm:text-3xl text-amber-950 font-[Zen_Maru_Gothic] font-bold">
        Kanban Managment Board
      </h1>
      <router-link to="/mykanban" class="flex gap-2 items-center justify-center">
        <p class="text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block">
          Ir a mi Kanban
        </p>
        <div
          class="w-[50px] h-[50px] rounded-[50%] border-2 border-[#cc5c00c7] bg-[url('/C_rakugo.svg')] bg-no-repeat bg-center bg-cover bg-amber-50 p-1"
        ></div>
      </router-link>
    </header>
    <main class="flex flex-col gap-4 items-start w-full relative mt-20">
      <div class="flex flex-col justify-between gap-1 w-full">
        <div class="flex flex-col px-4 items-end fixed top-50 right-4 z-50 py-4">
          <div class="flex gap-2 items-center justify-center relative">
            <label
              for="color-filter"
              class="cursor-pointer text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block"
            >
              Filtrar
            </label>
            <button
              id="color-filter"
              class="w-[30px] h-[30px] rounded-[50%] border-2 bg-amber-900 border-[#7D2E00] bg-no-repeat bg-center bg-contain cursor-pointer transition hover:bg-emerald-300 hover:border-emerald-300"
              @click="selectVisible = !selectVisible"
            ></button>
          </div>
          <div
            v-if="selectVisible"
            class="mt-3 bg-white border-2 border-amber-800 rounded-lg shadow-lg absolute right-0 top-16 p-4 w-48 pointer-events-auto"
          >
            <p class="text-amber-900 font-semibold mb-3 text-sm">Filtrar tareas:</p>
            <select
              v-model="selectedFilter"
              class="border-2 border-amber-800 rounded-md p-2 w-full outline-none focus:border-amber-900 bg-amber-50 text-amber-900 font-medium"
            >
              <option value="">Todas</option>
              <option value="completed">Completadas</option>
              <option value="assigned">Asignadas</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </div>
      </div>
      <p v-if="tareasApi?.length == 0" class="text-white text-shadow-emerald-950 font-bold text-xl">
        No hay tareas con el filtro seleccionado
      </p>
      <div class="flex flex-wrap gap-[2rem] ps-2 pe-12 w-full">
        <div class="flex md:w-[30%] lg:w-[20%] w-full" v-for="task in tareasApi" :key="task.id">
          <TaskCard
            :id="task.id"
            :text="task.todo"
            :completed="task.completed"
            :asigned="isTaskAssigned(task.id)"
            :card-color="
              task.completed
                ? 'bg-rose-500/20 border-rose-500/50 '
                : isTaskAssigned(task.id)
                  ? 'bg-white/30 border-green-200/50'
                  : assignedTasks.some((id) => id == task.id)
                    ? 'bg-green-900/50 border-green-900'
                    : 'bg-white border-orange-200/50 shadow-md hover:scale-[1.05]'
            "
            :disable="assignedTasks.some((id) => id == task.id)"
            @get="getTask"
          />
        </div>
      </div>
    </main>
  </section>
</template>

<script setup>
import { useGetDataApi } from '@/stores/getDataApi'
import { ref, onMounted, computed } from 'vue'
import { guardarPerfilUsuario, getAllTasks } from '@/services/workspaceData'
import TaskCard from '@/components/TaskCard.vue'
import { useToast } from 'vue-toastification'
import { usuario } from '@/services/authFirebase'

let selectVisible = ref(false)

let todasTareas = ref([])
let tareasApi = computed(() => {
  const filter = selectedFilter.value
  if (filter === 'completed') {
    return tareasStore.tareas.filter((task) => task.completed === true)
  } else if (filter === 'assigned') {
    return tareasStore.tareas.filter((task) => isTaskAssigned(task.id))
  } else if (filter === 'pending') {
    return tareasStore.tareas.filter((task) => !isTaskAssigned(task.id) && task.completed === false)
  } else {
    return tareasStore.tareas
  }
})
const toast = useToast()
const tareasStore = useGetDataApi()
const assignedTasks = ref([])
const selectedFilter = ref('')

const isTaskAssigned = (taskId) => {
  return todasTareas.value.some((user) => user.tareasAsigned.some((t) => t.id === taskId))
}

/* const isTaskCompleted = (taskId) => {
  return todasTareas.value.some((user) => user.tareasAsigned.some((t) => t.id === taskId && t.completed))
} */

const getTask = async (tarea) => {
  let result = await guardarPerfilUsuario(usuario.value.uid, 'tareas', tarea)
  if (result.ok) {
    assignedTasks.value.push(tarea.id)
    console.log(assignedTasks.value)

    // Refresh the users collection to reflect the new assignment
    let dbanswer = await getAllTasks()
    if (dbanswer.ok) {
      todasTareas.value = dbanswer.data
    }

    toast.success(result.mensaje, { timeout: 1500 })
  } else {
    toast.error(result.mensaje, { timeout: false })
  }
}

onMounted(async () => {
  await tareasStore.getData()

  let dbanswer = await getAllTasks()
  if (dbanswer.ok) {
    todasTareas.value = dbanswer.data
    //console.log(todasTareas.value);
  } else {
    toast.error(`Un fallo en conexion con data base ${dbanswer.code}`, { timeout: false })
  }
})
</script>

<style></style>
