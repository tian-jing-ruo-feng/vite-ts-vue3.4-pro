import { defineStore } from 'pinia'
export const useTaskGroupStore = defineStore('taskGroup', {
  state: () => {
    return {
      tags: []
    }
  }
})
