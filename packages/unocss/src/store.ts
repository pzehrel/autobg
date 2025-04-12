export function createStore() {
  const state = {
    root: '',
  }
  /**
   * Finds the root directory from config or ctx
   *
   * If `roots.configRoot` is provided, it returns that.
   * If `roots.ctxRoot` is provided, it returns that.
   *
   * @param roots - The root directories object
   * @param roots.ctxRoot - The transformer context root directory
   * @param roots.configRoot - The config root directory
   */
  const updateRoot = (roots: { ctxRoot?: string, configRoot?: string }) => {
    if (state.root) {
      return
    }

    const root: string = roots.configRoot ?? roots.ctxRoot ?? ''
    state.root = root.replace(/\\/g, '/')
  }

  return {
    get root() {
      return state.root
    },
    updateRoot,
  }
}

export type Store = ReturnType<typeof createStore>
