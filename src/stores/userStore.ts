import { defineStore } from 'pinia'
interface UserState {
  name: string
  id: string
}
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: '',
    id: '',
  }),

  actions: {
    setUser(user: { name: string; role: string; id: string }) {
      this.name = user.name
      this.id = user.id
    },
  },
  getters: {
    getId: (state): string => state.id,
    isAuthenticated: (state): boolean => state.name !== '',
    getUser: (state): string => state.name,
    isNotLoaded: (state): boolean => state.name == '',
  },
})
