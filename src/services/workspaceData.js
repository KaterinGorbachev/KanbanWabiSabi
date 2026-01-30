import { db } from '@/database/databaseconfig'
import {
  // referencia al documento (registro) dentro de la tabla
  doc,
  // insert en la tabla
  setDoc,
  // get
  getDoc,
  updateDoc,
} from 'firebase/firestore'

// crear o actualizar perfil de usuario
export const guardarPerfilUsuario = async (usuarioID, table, datosPerfil) => {
  try {
    const docRef = doc(db, table, usuarioID)
    await setDoc(docRef, datosPerfil)
    return {
      ok: true,
      mensaje: 'Tareas de usuario han actualizado correctamente',
    }
  } catch (error) {
    console.log('Ha habido un problema', error)
    return {
      ok: false,
      mensaje: error.message,
    }
  }
}

export const obtenerPerfilUsuario = async (usuarioID, table) => {
  try {
    const docRef = doc(db, table, usuarioID)

    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return {
        ok: true,
        mensaje: 'Datos ha obtenido correctamente',
        perfil: { id: docSnap.id, ...docSnap.data() },
      }
    }
  } catch (error) {
    console.log('Ha habido un problema', error)
    return {
      ok: false,
      mensaje: error.message,
    }
  }
}
