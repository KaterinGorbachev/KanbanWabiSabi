<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <!-- Modal -->
      <div
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-scale-in flex flex-col gap-[2rem]"
      >
        <!-- Icon -->
        <div class="mb-4 flex justify-center text-blue-500 text-3xl">
          <i class="fa-solid fa-info"></i>
        </div>

        <div class="flex flex-col justify-between gap-[1rem]">
          <p class="text-center text-gray-700 text-xl">
            {{ message }}
          </p>
          <ButtonBasic
            label="Reenviar el email de verificación"
            class="text-gray-400 border-2 rounded-md p-0.5 cursor-pointer transition hover:bg-[#8dbfff] hover:border-[#8dbfff] hover:text-black"
            @onclick="sendEmail"
          />
        </div>

        <div class="flex flex-col justify-between items-center">
          <p class="text-[14px] text-gray-400">
            <i>Si no os ha redirigido automáticamente por verificar el email</i>
          </p>

          <ButtonBasic
            label="Recarga la pagina"
            class="w-full bg-amber-500/30 text-amber-950 p-2 rounded-md cursor-pointer transition border-amber-100 hover:bg-[#8dbfff]"
            @onclick="reload"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import ButtonBasic from './ButtonBasic.vue'
import { usuario } from '@/services/authFirebase'
import { enviarEmailVerificacion } from '@/services/authFirebase'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()

if (usuario.value?.emailVerified) {
  router.push('/')
}

const sendEmail = async () => {
  let email_enviado = await enviarEmailVerificacion(usuario.value)
  if (email_enviado.ok) {
    toast.success(email_enviado.mensaje, { timeout: 2500 })
  } else {
    toast.error(email_enviado.mensaje, { timeout: 2500 })
  }
}

const reload = () => {
  router.push('/')
}

defineProps({
  message: String,
})
</script>

<style></style>
