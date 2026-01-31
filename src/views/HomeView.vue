<template>
  <section
    class="flex flex-col gap-[2rem] bg-[url('/public/background.jpg')] lg:bg-no-repeat lg:bg-cover md:bg-no-repeat md:bg-cover bg-center p-[3rem]"
  >
    <header
      class="sticky top-0 z-50 py-3 flex flex-col items-center gap-4 lg:flex-row justify-between"
    >
      <h1 class="text-[16px] sm:text-3xl text-amber-950 font-[Zen_Maru_Gothic] font-bold">
        Kanban Managment Board
      </h1>
      <div class="flex gap-2 items-center justify-center">
        <p class="text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block">
          Ir a mi Kanban
        </p>
        <router-link
          to="/mykanban"
          class="w-[60px] h-[60px] rounded-[50%] border-2 border-amber-800 bg-[url('/public/undraw_friendly-guy-avatar_ibbp.svg')] bg-no-repeat bg-center bg-contain bg-amber-50"
        ></router-link>
      </div>
    </header>
    <main class="flex flex-col gap-4 items-start w-full">
      <div class="flex flex-col w-full items-end sticky top-20 z-40">
        <div class="flex gap-2 items-center justify-center relative">
          <p class="text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block">
            Filtrar
          </p>
          <button
            class="w-[30px] h-[30px] rounded-[50%] border-2 border-amber-800 bg-[url('')] bg-no-repeat bg-center bg-contain bg-amber-50 cursor-pointer"
            @click="selectVisible = !selectVisible"
          ></button>
        </div>
        <div
          v-if="selectVisible"
          class="mt-2 bg-amber-50 border border-amber-800 rounded-md p-4 shadow-md absolute right-0 top-10"
        >
          <p class="text-amber-900 font-medium mb-2">Filtrar tareas por estado:</p>
          <select v-model="selectedFilter" class="border border-amber-800 rounded-md p-2 w-full outline-amber-800">
            <option value="all">Todas</option>
            <option value="completed">Completadas</option>
            <option value="assigned">Asignadas</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>
      </div>
      <div class="flex flex-wrap gap-[2rem]">
        <TaskCard
          v-for="task in tareasStore.tareas"
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
import { ref, onMounted, computed } from 'vue'
import { guardarPerfilUsuario, getAllTasks } from '@/services/workspaceData'
import TaskCard from '@/components/TaskCard.vue'
import { useToast } from 'vue-toastification'
import { usuario } from '@/services/authFirebase'

let selectVisible = ref(false)

let todasTareas = ref([])
const toast = useToast()
const tareasStore = useGetDataApi()
const assignedTasks = ref([])
const selectedFilter = ref('all')

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

onMounted(async () => {
  tareasStore.getData()

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
