export type Listener<TState> = (currentState: TState) => void

export function createStore<TState>(initialState: TState) {
  const listeners = new Set<Listener<TState>>()
  const state: TState = initialState

  const update = (updatedState: Partial<TState>) => {
    // @ts-ignore
    Object.assign(state, updatedState)
    listeners.forEach((listener) => listener(state))
  }

  const subscribe = (listener: Listener<TState>) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const cleanup = () => listeners.clear()

  const getState = () => state

  return {
    update,
    subscribe,
    cleanup,
    getState,
  }
}

export const makeImageCache = () => {
  const loadedImageSet = new Set<string>()

  const checkImageLoaded = (src: string) => loadedImageSet.has(src)

  const createZoomImage = ({
    src,
    store,
    img,
  }: {
    src: string
    store: ReturnType<typeof createStore>
    img: HTMLImageElement
  }) => {
    img.src = src
    if (checkImageLoaded(src)) return

    loadedImageSet.add(src)

    store.update({ zoomedImgStatus: "loading" })

    img.addEventListener("load", () => {
      store.update({ zoomedImgStatus: "loaded" })
    })

    img.addEventListener("error", () => {
      store.update({ zoomedImgStatus: "error" })
    })
  }

  return {
    createZoomImage,
    checkImageLoaded,
  }
}

export const imageCache = makeImageCache()