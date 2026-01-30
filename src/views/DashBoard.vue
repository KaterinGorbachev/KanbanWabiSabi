<template>
  <section class="flex flex-col gap-[4rem] bg-[url('/public/background.jpg')] lg:bg-no-repeat lg:bg-cover md:bg-no-repeat md:bg-cover bg-center p-[3rem] min-h-screen">
    <header>
      <div>
        <h1>Kanban Managment Board</h1>
        <router-link to="/">Explorar todas las tareas</router-link>
      </div>
      <div>
        <div>
          <h2>¡Bienvinido de nuevo, {{ usuario?.email }}!</h2>
          <p>Aquí puede ver todas su tareas</p>
        </div>

        <ButtonBasic
        @onclick="userLogout"
        label="Log out" />

      </div>
    </header>
    <main class="flex flex-wrap gap-[2rem]">
      <p v-if="myKanban.length == 0">No tienes las tareas asignadas todavia</p>
      <TaskCard
      v-for="task in myKanban" :key="task.id"
      :id="task.id"
      :text="task.text"
      :completed="task.completed"
      :asigned="false"
      :mytask="true"
      :card-color= "task.completed ? 'bg-rose-50/70 border-rose-200/50' : 'bg-green-50/70 border-green-200/50'"

    />
    </main>


  </section>



</template>

<script setup>
import { usuario } from '@/services/authFirebase';
import { obtenerPerfilUsuario } from '@/services/workspaceData';
import ButtonBasic from '@/components/ButtonBasic.vue';
import TaskCard from '@/components/TaskCard.vue';
import { ref, watch } from "vue";
import { logout } from '@/services/authFirebase';
import { useToast } from 'vue-toastification';


const toast = useToast()
let myKanban = ref({})


const userLogout = async() => {
  await logout()
}

const getKanban = async()=>{
  let result = await obtenerPerfilUsuario(usuario.value.uid, 'tareas')
  if(result.ok){
    myKanban.value = result.perfil.tareasAsigned
    console.log(myKanban.value);

  }else{
    toast.error(result.mensaje, {timeout:false})
  }
}


watch((usuario), (newUsuario) => {
  if (newUsuario?.uid) {
    getKanban(newUsuario.uid)
  }
}, { immediate: true })


</script>

<style>

</style>
