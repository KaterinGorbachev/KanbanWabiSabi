<template>
  <section
    class="flex flex-col gap-[2rem] bg-[url('/background.jpg')] bg-cover bg-no-repeat bg-[#FAE8B4] p-[3rem] min-h-screen w-full"
  >
    <header class="sticky top-0 z-50 py-2 flex justify-between">
      <router-link
        to="/"
        class="flex gap-2 items-center justify-center"
        ><div class="w-[50px] h-[50px] rounded-[50%] border-2 border-[#fff] bg-[url('/N_night-view.svg')] bg-contain bg-no-repeat bg-center bg-[#693c00]"></div>
        <p class="text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block"> Ir a Managment Board </p>
      </router-link>
      <div class="flex gap-2 items-center justify-center">
        <label for="logout" class="text-xs text-amber-800 tracking-widest writing-mode-vertical hidden sm:block cursor-pointer">
          Log out
        </label>
        <ButtonBasic
          id="logout"
          @onclick="userLogout"
          classes="w-[40px] h-[40px] rounded-[50%] border-2 border-[#cc5c00c7] bg-[url('/P_tomb-emperor-nintoku.svg')] bg-center bg-no-repeat bg-center bg-cover cursor-pointer bg-amber-50"
        />
      </div>
    </header>

    <main class="flex flex-col justify-between gap-6">
      <div class="flex flex-col justify-between gap-1">
        <h1 class="text-3xl text-amber-950 text-shadow-emerald-950 font-[Zen_Maru_Gothic] font-bold">Wabi Sabi Board</h1>
        <h2 class="text-white text-shadow-emerald-950 text-xl font-bold">¡Bienvinido de nuevo, {{ usuario?.email }}!</h2>
        <p class="text-white text-shadow-emerald-950">Fluye en equilibrio con el río del tiempo y disfruta de tu trabajo; no dejes que las
          imperfecciones te perturben.</p>
      </div>
      <p v-if="myKanban.length == 0">No tienes las tareas asignadas todavia</p>
      <div class="flex flex-wrap gap-[2rem]">
        <TaskCard
          v-for="task in myKanban"
          :key="task.id"
          :id="task.id"
          :text="task.text"
          :completed="task.completed"
          :asigned="false"
          :mytask="true"
          :card-color="
            task.completed
              ? 'bg-rose-50/70 border-rose-200/50'
              : 'bg-white/90 border-amber-200/50'
          "
        />
      </div>
    </main>
  </section>
</template>

<script setup>
import { usuario } from '@/services/authFirebase'
import { obtenerPerfilUsuario } from '@/services/workspaceData'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TaskCard from '@/components/TaskCard.vue'
import { ref, watch } from 'vue'
import { logout } from '@/services/authFirebase'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
let myKanban = ref({})

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
    console.log(myKanban.value)
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
