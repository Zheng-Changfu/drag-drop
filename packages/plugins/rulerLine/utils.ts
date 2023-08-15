export function isFlexLayout(element: HTMLElement) {
  const style = window.getComputedStyle(element)
  return style.display === 'flex'
}

export function isFlexRowLayout(element: HTMLElement) {
  const style = window.getComputedStyle(element)
  return isFlexLayout(element) && ['row', 'row-reverse'].includes(style.flexDirection)
}

export function isBlockLayout(element: HTMLElement) {
  const style = window.getComputedStyle(element)
  return style.display === 'block'
}

export function isTableLayout(element: HTMLElement) {
  const style = window.getComputedStyle(element)
  return style.display === 'table'
}

export function isGridLayout(element: HTMLElement) {
  const style = window.getComputedStyle(element)
  return style.display === 'grid'
}

export function getGridTemplateColumns(element: HTMLElement) {
  if (!isGridLayout(element)) return 0
  const style = window.getComputedStyle(element)
  return style.gridTemplateColumns.split(' ').length
}

export function pxToNumber(px: string) {
  return Number.parseFloat(px)
}

export function isWidthFull(element: HTMLElement, parentElement: HTMLElement) {
  const elementStyle = window.getComputedStyle(element)
  const parentElementStyle = window.getComputedStyle(parentElement)

  const elementFullWidth = pxToNumber(elementStyle.width)
  + pxToNumber(elementStyle.paddingLeft)
  + pxToNumber(elementStyle.paddingRight)
  + pxToNumber(elementStyle.marginLeft)
  + pxToNumber(elementStyle.marginRight)
  + pxToNumber(elementStyle.borderLeft)
  + pxToNumber(elementStyle.borderRight)

  const parentElementInnerWidth = pxToNumber(parentElementStyle.width)
  - pxToNumber(parentElementStyle.paddingLeft)
  - pxToNumber(parentElementStyle.paddingRight)
  - pxToNumber(parentElementStyle.marginLeft)
  - pxToNumber(parentElementStyle.marginRight)
  - pxToNumber(parentElementStyle.borderLeft)
  - pxToNumber(parentElementStyle.borderRight)

  return elementFullWidth >= parentElementInnerWidth
}
