<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <!-- Modal -->
      <div
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-scale-in"
      >
        <!-- Icon -->
        <div class="mb-4 flex justify-center text-blue-500 text-3xl">
          <i class="fa-solid fa-info"></i>
        </div>

        <!-- Message -->
        <p class="mb-6 text-center text-gray-700">
          {{ message }}
        </p>

        <!-- Action -->
        <ButtonBasic
          label="Reenviar el email de verificación"
          class="w-full"
          @onclick="sendEmail"
        />
        <ButtonBasic
          label="Recarga la pagina"
          class="w-full"
          @onclick="reload"
        />

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import ButtonBasic from './ButtonBasic.vue';
import { usuario } from '@/services/authFirebase';
import { enviarEmailVerificacion } from '@/services/authFirebase';
import { useToast } from 'vue-toastification';
const toast = useToast()

const sendEmail = async ()=> {
  let email_enviado = await enviarEmailVerificacion(usuario.value)
    if (email_enviado.ok) {
      toast.success(email_enviado.mensaje, { timeout: 2500 })
    } else {
      toast.error(email_enviado.mensaje, { timeout: 2500 })
    }

}

const reload = ()=>{
  window.location.reload()
}

defineProps(
  {
    message: String
  }
)

</script>

<style>

</style>
