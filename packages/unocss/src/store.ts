import process from 'node:process'

export function createStore() {
  const state = {
    root: process.cwd(),
  }

  return {
    get root() {
      return state.root
    },
    set root(value) {
      state.root = value
    },
  }
}

export type Store = ReturnType<typeof createStore>
