import { db } from '@/database/databaseconfig'
import {
  // referencia al documento (registro) dentro de la tabla
  doc,
  // insert en la tabla
  setDoc,
  // get
  getDoc,
  getDocs,
  collection,
  updateDoc,
  arrayUnion
} from 'firebase/firestore'

import { mapFirebaseError } from './firebaseErrors'

// crear o actualizar perfil de usuario
export const guardarPerfilUsuario = async (uid, table, tarea) => {
  const docRef = doc(db, table, uid)

  try {
    // 🔹 Try to update first
    await updateDoc(docRef, {
      tareasAsigned: arrayUnion(tarea)
    })

    return { ok: true, mensaje: 'Tarea asignada correctamente' }

  } catch (error) {
    // If doc does not exist → create it
    if (error.code === 'not-found') {
      await setDoc(docRef, {
        tareasAsigned: [tarea]
      })

      return { ok: true, mensaje: 'Perfil creado y tarea asignada' }
    }

    // Any other error
    return { ok: false, mensaje: mapFirebaseError(error) }
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
    console.log('Ha habido un problema', error.code, error)
    return {
      ok: false,
      code: error.code,
      mensaje: mapFirebaseError(error),
    }
  }
}


export const getAllTasks = async()=> {
  try {
    let tareas = []
    const querySnapshot = await getDocs(collection(db, "tareas"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // doc.id user.uid
      // doc.data() users tareas
      //console.log(doc.data());
      tareas.push({
        uid: doc.id,
        ...doc.data()
      })
    });
    return {
        ok: true,
        mensaje: 'Todas tareas',
        data: tareas,
      }

  } catch (error) {
    console.log('Ha habido un problema', error.code, error)
    return {
      ok: false,
      code: error.code
    }
  }
}
