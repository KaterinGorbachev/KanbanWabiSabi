import { ref } from "vue";
import { defineStore } from "pinia";

import axios from "axios";

export const useDatosFromAPIStore = defineStore('apiProductos', () => {
  const tareas = ref()
  const getData = async () => {
    const result = await axios.get('https://dummyjson.com/todos')
    tareas.value = result.todos

  }

  return { personajes, getData }
})
