import type { Component } from "solid-js"
import { createSignal, createMemo, createEffect, For } from "solid-js"
import { createZoomImageHover, createZoomImageWheel } from "@zoom-image/core"

type Tab = {
  name: string
  href: string
  current: boolean
  value: "wheel" | "hover"
}

const App: Component = () => {
  const [tabs, setTabs] = createSignal<Tab[]>([
    { name: "Zoom Image Wheel", href: "#", current: true, value: "wheel" },
    { name: "Zoom Image Hover", href: "#", current: false, value: "hover" },
  ])
  const zoomType = createMemo(() => tabs().find((tab) => tab.current).value)
  let imageWheelContainer: HTMLDivElement
  let imageHoverContainer: HTMLDivElement
  let zoomTarget: HTMLDivElement

  const makeHandleTabClick = (tab: Tab) => () => {
    setTabs(
      tabs().map((t) => {
        if (t.name === tab.name) {
          return { ...t, current: true }
        } else {
          return { ...t, current: false }
        }
      }),
    )
  }

  let cleanup: () => void = () => {}
  createEffect(() => {
    cleanup()

    if (zoomType() === "hover") {
      const imageContainer = imageHoverContainer
      const result = createZoomImageHover(imageContainer, {
        zoomImageSource: "/large.webp",
        customZoom: { width: 300, height: 500 },
        zoomTarget,
        scaleFactor: 0.5,
      })
      cleanup = result.cleanup
    }

    if (zoomType() === "wheel") {
      const imageContainer = imageWheelContainer
      const result = createZoomImageWheel(imageContainer)
      cleanup = result.cleanup
    }
  })

  return (
    <div class="font-sans">
      <nav class="flex space-x-4 pb-4" aria-label="Tabs">
        <For each={tabs()}>
          {(tab) => (
            <a
              onClick={makeHandleTabClick(tab)}
              href={tab.href}
              class={
                "rounded-md px-3 py-2 text-sm font-medium decoration-none " +
                (tab.current ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:text-gray-700")
              }
              aria-current={tab.current ? "page" : undefined}
            >
              {tab.name}
            </a>
          )}
        </For>
      </nav>

      {zoomType() === "wheel" && (
        <>
          <p>Scroll inside the image to see zoom in-out effect</p>
          <div ref={imageWheelContainer} id="image-wheel-container" class="w-[300px] h-[300px] cursor-crosshair">
            <img class="w-full h-full" alt="Large Pic" src="/large.webp" elementtiming="" fetchpriority="high" />
          </div>
        </>
      )}

      {zoomType() === "hover" && (
        <div id="image-hover-container" ref={imageHoverContainer} class="relative flex items-start w-[250px] h-[250px]">
          <img class="w-full h-full" alt="Small Pic" src="/small.webp" elementtiming="" fetchpriority="high" />
          <div ref={zoomTarget} id="zoom-hover-target" class="absolute left-[300px]"></div>
        </div>
      )}
    </div>
  )
}

export default App
