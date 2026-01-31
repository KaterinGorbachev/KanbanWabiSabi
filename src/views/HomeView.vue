<template>
  <section
    class="flex flex-col gap-[2rem] bg-[url('/background.jpg')] bg-cover bg-no-repeat bg-[#FAE8B4] py-[3rem] px-[2rem] min-h-screen w-full"
  >
    <header
      class="sticky top-0 z-40 py-3 flex flex-col items-center gap-4 lg:flex-row justify-between"
    >
      <h1 class="text-[16px] sm:text-3xl text-amber-950 font-[Zen_Maru_Gothic] font-bold">
        Kanban Managment Board
      </h1>
      <router-link to="/mykanban" class="flex gap-2 items-center justify-center">
        <p class="text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block">
          Ir a mi Kanban
        </p>
        <div
          class="w-[40px] h-[40px] rounded-[50%] border-2 border-[#cc5c00c7] bg-[url('/C_rakugo.svg')] bg-no-repeat bg-center bg-cover bg-amber-50 p-1"
        ></div>
      </router-link>
    </header>
    <main class="flex flex-col gap-4 items-start w-full">
      <div class="flex flex-col w-full items-end sticky top-20 z-40 p-4">
        <div class="flex gap-2 items-center justify-center relative p-4">
          <label
            for="filter"
            class="cursor-pointer text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block"
          >
            Filtrar
          </label>
          <button
            id="filter"
            class="w-[30px] h-[30px] rounded-[50%] border-2 border-amber-800 bg-[url('')] bg-no-repeat bg-center bg-contain bg-amber-800 cursor-pointer transition hover:bg-emerald-300 hover:border-emerald-300"
            @click="selectVisible = !selectVisible"
          ></button>
        </div>
        <div
          v-if="selectVisible"
          class="mt-2 bg-amber-50 border border-amber-800 rounded-md shadow-md absolute right-0 top-15 p-2"
        >
          <p class="text-amber-900 font-medium mb-2">Filtrar tareas por estado:</p>
          <select
            v-model="selectedFilter"
            class="border border-amber-800 rounded-md p-2 w-full outline-amber-800"
          >
            <option value="">Todas</option>
            <option value="completed">Completadas</option>
            <option value="assigned">Asignadas</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>
      </div>
      <p v-if="tareasApi?.length == 0" class="text-white text-shadow-emerald-950 font-bold text-xl">
        No hay tareas con el filtro seleccionado
      </p>
      <div class="flex flex-wrap gap-[2rem] ps-2 pe-9">
        <TaskCard
          v-for="task in tareasApi"
          :key="task.id"
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
    </main>
  </section>
</template>

<script setup>
import { useGetDataApi } from '@/stores/getDataApi'
import { ref, onMounted, watch } from 'vue'
import { guardarPerfilUsuario, getAllTasks } from '@/services/workspaceData'
import TaskCard from '@/components/TaskCard.vue'
import { useToast } from 'vue-toastification'
import { usuario } from '@/services/authFirebase'

let selectVisible = ref(false)

let todasTareas = ref([])
let tareasApi = ref([])
const toast = useToast()
const tareasStore = useGetDataApi()
const assignedTasks = ref([])
const selectedFilter = ref('')

const isTaskAssigned = (taskId) => {
  return todasTareas.value.some((user) => user.tareasAsigned.some((t) => t.id === taskId))
}

const getTask = async (tarea) => {
  let result = await guardarPerfilUsuario(usuario.value.uid, 'tareas', tarea)
  if (result.ok) {
    assignedTasks.value.push(tarea.id)
    console.log(assignedTasks.value)

    toast.success(result.mensaje, { timeout: 1500 })
  } else {
    toast.error(result.mensaje, { timeout: false })
  }
}

watch(
  selectedFilter,
  (newFilter) => {
    if (newFilter === 'completed') {
      tareasApi.value = tareasStore.tareas.filter((task) => task.completed === true)
    } else if (newFilter === 'assigned') {
      tareasApi.value = tareasStore.tareas.filter((task) => isTaskAssigned(task.id))
    } else if (newFilter === 'pending') {
      tareasApi.value = tareasStore.tareas.filter(
        (task) => !isTaskAssigned(task.id) && task.completed === false,
      )
    } else {
      tareasApi.value = tareasStore.tareas
    }
  },
  { immediate: true },
)

onMounted(async () => {
  await tareasStore.getData()
  tareasApi.value = tareasStore.tareas

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
