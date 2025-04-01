export function createStore() {
  const state = {
    root: undefined as string | undefined,
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
