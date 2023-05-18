import { useCallback, useEffect, useRef, useState } from "react"
import { createZoomImageWheel as _createZoomImageWheel } from "@zoom-image/core"
import { noop } from "./shared"

import type { ZoomImageWheelState } from "@zoom-image/core"

export function useZoomImageWheel() {
  const result = useRef<ReturnType<typeof _createZoomImageWheel>>()
  const [zoomImageState, updateZoomImageState] = useState<ZoomImageWheelState>({
    currentPositionX: -1,
    currentPositionY: -1,
    currentZoom: -1,
    enable: false,
  })

  const createZoomImage = useCallback((...arg: Parameters<typeof _createZoomImageWheel>) => {
    result.current?.cleanup()
    result.current = _createZoomImageWheel(arg[0], arg[1])
    updateZoomImageState(result.current.getState())

    result.current.subscribe((state) => {
      updateZoomImageState(structuredClone(state))
    })
  }, [])

  useEffect(() => {
    return () => {
      result.current?.cleanup()
    }
  }, [])

  return {
    createZoomImage,
    zoomImageState,
    setZoomImageState: result.current?.setState ?? noop,
  }
}