<template>
  <section
    class="flex flex-col gap-[2rem] bg-[url('/background.jpg')] bg-cover bg-no-repeat bg-[#FAE8B4]  min-h-screen w-full"
  >
    <div
      class="flex flex-col justify-start items-start w-full sm:w-full md:w-[50%] lg:w-[40%] bg-drop-blur bg-white/40 px-[2rem] sm:px-[3rem] py-[3rem] min-h-screen gap-[2rem]"
    >
      <header class="w-full text-start flex flex-col gap-1">
        <h1 class="text-3xl text-amber-950 font-[Zen_Maru_Gothic] font-bold">Kanban Wabi Sabi</h1>
        <p class="text-sm text-amber-900/60">
          Es un espacio tranquilo para tu trabajo. Las tareas se mueven con suavidad, desde el
          inicio hasta el final y el descanso. Inisia sesión para empezar.
        </p>
      </header>
      <div v-if="loginToggle" class="flex flex-col gap-6">
        <!--Login div-->
        <h2 class="text-2xl text-amber-950">Inicia sessión</h2>
        <form @submit.prevent="loginUser" class="flex flex-col gap-4 w-full">
          <div>
            <label for="email" class="text-[1rem] text-amber-950">Email</label>
            <div
              class="flex items-center justify-center gap-1 text-amber-900 bg-amber-100 px-3 py-1 rounded-md w-full"
            >
              <i class="fa-solid fa-envelope"></i>
              <input
                type="email"
                name="email"
                id="email"
                v-model="email"
                placeholder="myemail@example.com"
                required
                class="outline-none"
              />
            </div>
          </div>
          <div>
            <label for="password" class="text-[1rem] text-amber-950">Contraseña</label>
            <div
              class="flex items-center justify-center gap-1 text-amber-900 bg-amber-100 px-3 py-1 rounded-md"
            >
              <i class="fa-solid fa-key"></i>
              <input
                type="password"
                name="password"
                id="password"
                v-model="password"
                placeholder="Introduce su contraseña"
                required
                class="outline-none"
              />
            </div>
          </div>

          <button
            type="sumbit"
            class="bg-blue-200 rounded-md cursor-pointer text-amber-950 hover:bg-green-200 px-6 py-2 mt-4"
          >
            {{ cargando ? 'En proceso...' : 'Iniciar sesión' }}
          </button>
        </form>
      </div>
      <div v-else class="flex flex-col gap-6">
        <!--Register div-->
        <h2 class="text-2xl text-amber-950">Registrarse</h2>
        <form @submit.prevent="registerUser" class="flex flex-col gap-4 w-full">
          <div>
            <label for="email" class="text-[1rem] text-amber-950">Email</label>
            <div
              class="flex items-center justify-center gap-1 text-amber-900 bg-amber-100 px-3 py-1 rounded-md"
            >
              <i class="fa-solid fa-envelope"></i>
              <input
                type="email"
                name="email"
                id="email"
                v-model="email"
                placeholder="myemail@example.com"
                required
                class="outline-none"
              />
            </div>
          </div>
          <div>
            <label for="password" class="text-[1rem] text-amber-950">Contraseña</label>
            <div
              class="flex items-center justify-center gap-1 text-amber-900 bg-amber-100 px-3 py-1 rounded-md"
            >
              <i class="fa-solid fa-key"></i>
              <input
                type="password"
                name="password"
                id="password"
                v-model="password"
                placeholder="Minimum 6 symbolos"
                required
                class="outline-none"
              />
            </div>
            <small v-if="!coinciden" class="text-red-500">Contraseñas no coinciden</small>
          </div>
          <div class="w-full flex flex-col">
            <label for="password" class="text-[1rem] text-amber-950">Repite la contraseña</label>
            <div
              class="flex items-center justify-center gap-1 text-amber-900 bg-amber-100 px-3 py-1 rounded-md w-full"
            >
              <i class="fa-solid fa-check-double"></i>
              <input
                type="password"
                name="password"
                id="password"
                v-model="passwordConfirm"
                placeholder="Repite la contraseña"
                required
                class="outline-none bg-transparent w-full"
              />
            </div>
            <small v-if="!coinciden" class="text-red-500">Contraseñas no coinciden</small>
          </div>

          <button
            type="sumbit"
            class="bg-blue-200 rounded-md cursor-pointer text-amber-950 hover:bg-green-200 px-6 py-2 mt-4"
          >
            {{ cargando ? 'En proceso...' : 'Registrarse' }}
          </button>
        </form>
      </div>

      <div class="flex flex-col lg:flex-row gap-1 items-center justify-center">
        <p class="italic text-amber-900 text-sm">
          {{ loginToggle ? 'Si no tiene cuenta' : 'Si tiene cuenta' }}
        </p>

        <button
          @click="loginToggle = !loginToggle"
          class="border-1 border-amber-900 rounded-md cursor-pointer text-amber-950 hover:bg-green-200 hover:border-green-200 px-3 py-1"
        >
          {{ loginToggle ? 'Ir a Register' : 'Ir a Login' }}
        </button>
      </div>

      <IsVerifiedEmailMessage
        v-if="usuario"
        :message="
          isVerified
            ? 'Verificando el usuario'
            : 'Email de verificación enviado. Revisa tu correo y verifica tu cuenta para continuar.'
        "
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usuario, registrar, login, enviarEmailVerificacion } from '@/services/authFirebase'
import { useToast } from 'vue-toastification'
import IsVerifiedEmailMessage from '@/components/IsVerifiedEmailMessage.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const toast = useToast()
let loginToggle = ref(true)
let email = ref('')
let password = ref('')
let passwordConfirm = ref('')
let cargando = ref(false)
let email_sent = ref(false)

const isVerified = computed(() => usuario.value?.emailVerified === true)

let coinciden = computed(() => {
  return password.value == passwordConfirm.value
})

const registerUser = async () => {
  if (!coinciden.value) {
    return toast.error('Las contraseñas no coinciden', { timeout: 2500 })
  }

  const result = await registrar(email.value, password.value)
  cargando.value = true
  if (result.ok) {
    toast.success(result.mensaje, { timeout: 2500 })
    email.value = ''
    password.value = ''
    passwordConfirm.value = ''
    cargando.value = false

    let userData = result.usuario.user
    let email_enviado_result = await enviarEmailVerificacion(userData)
    if (email_enviado_result.ok) {
      //toast.success(email_enviado_result.mensaje, { timeout: 2500 })
      email_sent.value = true
    } else {
      toast.error(email_enviado_result.mensaje, { timeout: 2500 })
    }
  } else {
    cargando.value = false
    toast.error(result.mensaje, { timeout: 2500 })
  }
}

const loginUser = async () => {
  const result = await login(email.value, password.value)
  cargando.value = true
  if (result.ok) {
    toast.success(result.mensaje, { timeout: 2500 })
    email.value = ''
    password.value = ''
    cargando.value = false
  } else {
    cargando.value = false
    toast.error(result.mensaje, { timeout: 2500 })
  }
}
</script>

<style></style>
