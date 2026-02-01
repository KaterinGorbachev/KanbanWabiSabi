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
  arrayUnion,
} from 'firebase/firestore'

import { mapFirebaseError } from './firebaseErrors'

// crear o actualizar perfil de usuario
export const guardarPerfilUsuario = async (uid, table, tarea) => {
  const docRef = doc(db, table, uid)

  try {
    // 🔹 Try to update first
    await updateDoc(docRef, {
      tareasAsigned: arrayUnion(tarea),
    })

    return { ok: true, mensaje: 'Tarea asignada correctamente' }
  } catch (error) {
    // If doc does not exist → create it
    if (error.code === 'not-found') {
      await setDoc(docRef, {
        tareasAsigned: [tarea],
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
    } else {
      return {
        ok: true,
        mensaje: 'Usuario sin perfil todavía',
        perfil: {
          id: usuarioID,
          tareasAsigned: [],
        },
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

export const getAllTasks = async () => {
  try {
    let tareas = []
    const querySnapshot = await getDocs(collection(db, 'tareas'))
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // doc.id user.uid
      // doc.data() users tareas
      //console.log(doc.data());
      tareas.push({
        uid: doc.id,
        ...doc.data(),
      })
    })
    return {
      ok: true,
      mensaje: 'Todas tareas',
      data: tareas,
    }
  } catch (error) {
    console.log('Ha habido un problema', error.code, error)
    return {
      ok: false,
      code: error.code,
    }
  }
}

// Save task color to Firebase by updating the task in tareasAsigned array
export const updateTaskColor = async (uid, table, taskId, backgroundColor) => {
  try {
    const docRef = doc(db, table, uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { ok: false, error: 'User profile not found' }
    }

    const tareasAsigned = docSnap.data().tareasAsigned || []

    // Find and update the task with matching id
    const updatedTareas = tareasAsigned.map((tarea) =>
      tarea.id === taskId ? { ...tarea, backgroundColor } : tarea,
    )

    await updateDoc(docRef, {
      tareasAsigned: updatedTareas,
      updatedAt: new Date(),
    })

    return { ok: true, mensaje: 'Color actualizado correctamente' }
  } catch (error) {
    console.error('[WORKSPACEDATA][UPDATE_COLOR]', error)
    return { ok: false, error: mapFirebaseError(error) }
  }
}

// Update completed status in user's personal tasks (tareasAsigned)
export const updateTaskCompletedStatus = async (uid, table, taskId, completed, asigned) => {
  try {
    const docRef = doc(db, table, uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { ok: false, error: 'User profile not found' }
    }

    const tareasAsigned = docSnap.data().tareasAsigned || []

    // Find and update the task with matching id
    const updatedTareas = tareasAsigned.map((tarea) =>
      tarea.id === taskId ? { ...tarea, completed, asigned } : tarea,
    )

    await updateDoc(docRef, {
      tareasAsigned: updatedTareas,
      updatedAt: new Date(),
    })

    return { ok: true, mensaje: completed ? 'Tarea completada' : 'Tarea marcada como pendiente' }
  } catch (error) {
    console.error('[WORKSPACEDATA][UPDATE_COMPLETED]', error)
    return { ok: false, error: mapFirebaseError(error) }
  }
}

// Update completed status in main tasks collection
export const updateMainTaskCompletedStatus = async (taskId, completed) => {
  try {
    const docRef = doc(db, 'tareas', String(taskId))

    await updateDoc(docRef, {
      completed: completed,
      updatedAt: new Date(),
    })

    return { ok: true, mensaje: completed ? 'Tarea completada' : 'Tarea marcada como pendiente' }
  } catch (error) {
    console.error('[WORKSPACEDATA][UPDATE_MAIN_COMPLETED]', error)
    return { ok: false, error: mapFirebaseError(error) }
  }
}

// Delete task from user's tareasAsigned collection
export const deleteTaskFromUser = async (uid, table, taskId) => {
  try {
    const docRef = doc(db, table, uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { ok: false, error: 'User profile not found' }
    }

    const tareasAsigned = docSnap.data().tareasAsigned || []

    // Filter out the task with matching id
    const updatedTareas = tareasAsigned.filter((tarea) => tarea.id !== taskId)

    await updateDoc(docRef, {
      tareasAsigned: updatedTareas,
      updatedAt: new Date(),
    })

    return { ok: true, mensaje: 'Tarea eliminada correctamente' }
  } catch (error) {
    console.error('[WORKSPACEDATA][DELETE_TASK]', error)
    return { ok: false, error: mapFirebaseError(error) }
  }
}
