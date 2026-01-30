import { auth } from '@/database/databaseconfig'
import { mapAuthError } from './firebaseErrors'

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from 'firebase/auth'
import { ref } from 'vue'

// variable global del usuario
export let usuario = ref(null)

// escuchar los cambios de la authenticacion: logeado | nologeado
onAuthStateChanged(auth, (userFirebase) => {
  usuario.value = userFirebase
  console.log('Auth: usuario detectado: - ', userFirebase?.email || 'Ninguno')
})

export const registrar = async (email, password) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

    return {
      ok: true,
      mensaje: 'Usuario creado correctamente',
      usuario: userCredentials,
    }
  } catch (error) {
    console.error('[AUTH][REGISTER]', error.code, error.message)

    return {
      ok: false,
      code: error.code,
      mensaje: mapAuthError(error),
    }
  }
}

export const login = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password)

    return {
      ok: true,
      mensaje: 'Sesión iniciada correctamente',
      usuario: userCredentials,
    }
  } catch (error) {
    console.error('[AUTH][LOGIN]', error.code, error.message)

    return {
      ok: false,
      code: error.code,
      mensaje: mapAuthError(error),
    }
  }
}

export const enviarEmailVerificacion = async (usuarioActual = null) => {
  try {
    const user = usuarioActual || auth.currentUser

    if (!user) {
      return {
        ok: false,
        mensaje: 'No hay usuario autenticado',
      }
    }

    if (user.emailVerified) {
      return {
        ok: true,
        mensaje: 'El email ya está verificado',
      }
    }

    await sendEmailVerification(user, {
      url: `${window.location.origin}/workspace`,
    })

    return {
      ok: true,
      mensaje:
        'Email de verificación enviado. Revisa tu correo y verifica tu cuenta para continuar.',
    }
  } catch (error) {
    console.error('[AUTH][VERIFY EMAIL]', error.code, error.message)

    return {
      ok: false,
      code: error.code,
      mensaje: mapAuthError(error),
    }
  }
}

export const logout = async () => {
  try {
    await signOut(auth)

    return { ok: true }
  } catch (error) {
    console.error('[AUTH][LOGOUT]', error.code)

    return {
      ok: false,
      mensaje: 'No se pudo cerrar sesión',
    }
  }
}
