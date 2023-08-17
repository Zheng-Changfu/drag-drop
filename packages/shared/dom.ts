export function getBoundingClientRect(el: HTMLElement | undefined) {
  return el?.getBoundingClientRect() ?? { x: 0, y: 0, left: 0, right: 0, top: 0, bottom: 0 }
}
