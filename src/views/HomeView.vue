<template>
  <section class="flex flex-col gap-[4rem] bg-[url('/public/background.jpg')] lg:bg-no-repeat lg:bg-cover md:bg-no-repeat md:bg-cover bg-center p-[3rem]">
    <header>
      <h1>Kanban Managment Board</h1>
      <router-link to="/mykanban">Ir a mi Kanban</router-link>
    </header>
    <main class="flex flex-wrap gap-[2rem]">
      <TaskCard
      v-for="task in tareasStore.tareas" :key="task.id"
      :id="task.id"
      :text="task.todo"
      :completed="task.completed"
      :asigned="isTaskAssigned(task.id)"
      :card-color= "task.completed ? 'bg-rose-50/70 border-rose-200/50' : (isTaskAssigned(task.id) ? 'bg-white/30 border-green-200/50' : 'bg-yellow-50/70 border-yellow-200/50') "

      @get="getTask"

    />
    </main>

  </section>








</template>

<script setup>
import { useGetDataApi } from '@/stores/getDataApi';
import { ref, onMounted, computed } from 'vue'
import { guardarPerfilUsuario, getAllTasks } from '@/services/workspaceData';
import TaskCard from '@/components/TaskCard.vue';
import { useToast } from 'vue-toastification';
import { usuario } from '@/services/authFirebase';


let todasTareas = ref([])
const toast = useToast()
const tareasStore = useGetDataApi()

const isTaskAssigned = (taskId) => {
  return todasTareas.value.some(user =>
    user.tareasAsigned.some(t => t.id === taskId)
  )
}


const getTask = async(tarea)=> {
  let result = await guardarPerfilUsuario(usuario.value.uid, 'tareas', tarea)
  if(result.ok){
    toast.success(result.mensaje, { timeout:1500 })
  } else {
    toast.error(result.mensaje, { timeout:false })
  }
}

onMounted(async() => {
  tareasStore.getData()

  let dbanswer = await getAllTasks()
  if(dbanswer.ok){
    todasTareas.value = dbanswer.data
    console.log(todasTareas.value);

  } else {
    toast.error(`Un fallo en conexion con data base ${dbanswer.code}`, { timeout:false })
  }

})



</script>

<style>

</style>
