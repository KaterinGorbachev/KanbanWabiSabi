<template>

  <section>
    <header>
    <h1>Kanban Managment Board</h1>
    <p>
      Este tablero es un espacio tranquilo para tu trabajo. Las tareas se mueven con suavidad, desde
      el inicio hasta el final y el descanso. Fluye en equilibrio con el río del tiempo y disfruta de
      tu trabajo; no dejes que las imperfecciones te perturben.
    </p>
    <br><br>
    <p>Inisia sesión para empezar</p>
  </header>
    <div v-if="loginToggle">
      <!--Login div-->
      <h2>Inicia sessión</h2>
      <form @sumbit.prevent="loginUser">
        <div>
          <label for="email">Email</label>
          <div>
            <i class="fa-solid fa-envelope"></i>
            <input
              type="email"
              name="email"
              id="email"
              v-model="email"
              placeholder="myemail@example.com"
              required
            />
          </div>
        </div>
        <div>
          <label for="password">Contraseña</label>
          <div>
            <i class="fa-solid fa-key"></i>
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              placeholder="Introduce su contraseña"
              required
            />
          </div>
        </div>

        <button type="sumbit">{{ cargando ? 'En proceso...' : 'Iniciar sesión' }}</button>

      </form>
    </div>
    <div v-else>
      <!--Register div-->
      <h2>Registrarse</h2>
      <form @submit.prevent="registerUser">
        <div>
          <label for="email">Email</label>
          <div>
            <i class="fa-solid fa-envelope"></i>
            <input
              type="email"
              name="email"
              id="email"
              v-model="email"
              placeholder="myemail@example.com"
              required
            />
          </div>
        </div>
        <div>
          <label for="password">Contraseña</label>
          <div>
            <i class="fa-solid fa-key"></i>
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              placeholder="Minimum 6 symbolos"
              required
            />
          </div>
          <small v-if="!coinciden">Contraseñas no coinciden</small>
        </div>
        <div>
          <label for="password">Repite la contraseña</label>
          <div>
            <i class="fa-solid fa-check-double"></i>
            <input
              type="password"
              name="password"
              id="password"
              v-model="passwordConfirm"
              placeholder="Repite la contraseña introducida"
              required
            />
          </div>
          <small v-if="!coinciden">Contraseñas no coinciden</small>
        </div>

        <button type="sumbit">{{ cargando ? 'En proceso...' : 'Registrarse' }}</button>
      </form>
    </div>

    <button @click="loginToggle = !loginToggle">
      {{ loginToggle ? 'Ir a Register' : 'Ir a Login' }}
    </button>

    <IsVerifiedEmailMessage
      v-if="!usuario?.emailVerified"
      :message=" check_user ? 'Verificando el usuario' : 'Email de verificación enviado. Revisa tu correo y verifica tu cuenta para continuar.'"
    />

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usuario, registrar, login, enviarEmailVerificacion } from '@/services/authFirebase'
import { useToast } from 'vue-toastification'
import IsVerifiedEmailMessage from '@/components/IsVerifiedEmailMessage.vue'



const toast = useToast()
let loginToggle = ref(true)
let email = ref('')
let password = ref('')
let passwordConfirm = ref('')
let cargando = ref(false)
let email_sent = ref(false)

let check_user = computed(()=>{
  if(usuario.value) {
    return usuario.value.emailVerified
  } else {
    return false
  }
})

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
    cargando.value = false

    let userData = result.usuario.user
    let email_enviado_result = await enviarEmailVerificacion(userData)
    if (email_enviado_result.ok) {
      //toast.success(email_enviado_result.mensaje, { timeout: 2500 })
      email_sent.value = true
    } else {
      toast.error(email_enviado_result.mensaje, { timeout: 2500 })
    }
  }
  else {
    cargando.value = false
    toast.error(result.mensaje, { timeout: 2500 })

  }

}


const loginUser = async()=> {
  const result = await login(email.value, password.value)
  cargando.value = true
  if (result.ok) {
    toast.success(result.mensaje, { timeout: 2500 })
    email.value = ''
    password.value = ''
    cargando.value = false
  }
  else {
    cargando.value = false
    toast.error(result.mensaje, { timeout: 2500 })

  }

}


onMounted(()=>{
  setTimeout(()=>{
    console.log(usuario.value);
  }, 2500)
})


</script>

<style></style>
