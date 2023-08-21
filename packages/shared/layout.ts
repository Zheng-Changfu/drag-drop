export enum LayoutEnum {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}

export function isFlexLayout(val: HTMLElement) {
  const style = window.getComputedStyle(val)
  return style.display === 'flex'
}

export function isFlexRowDirectionLayout(val: HTMLElement) {
  const style = window.getComputedStyle(val)
  return style.flexDirection === 'row' || style.flexDirection === 'row-reverse'
}

export function isGridLayout(val: HTMLElement) {
  const style = window.getComputedStyle(val)
  return style.display === 'grid'
}

export function isTableLayout(val: HTMLElement) {
  const style = window.getComputedStyle(val)
  return style.display === 'table'
}

export function isBlockLayout(val: HTMLElement) {
  const style = window.getComputedStyle(val)
  return style.display === 'block'
}

export function getGridTemplateColumnsLen(val: HTMLElement) {
  const style = window.getComputedStyle(val)
  return style.gridTemplateColumns.split(' ').length
}

export function pxToNumber(val: string) {
  return Number.parseFloat(val)
}

export function widthIsFullContainer(element: HTMLElement, container: HTMLElement) {
  const elementStyle = window.getComputedStyle(element)
  const containerStyle = window.getComputedStyle(container)

  const elementFullWidth = pxToNumber(elementStyle.width)
  + pxToNumber(elementStyle.paddingLeft)
  + pxToNumber(elementStyle.paddingRight)
  + pxToNumber(elementStyle.marginLeft)
  + pxToNumber(elementStyle.marginRight)
  + pxToNumber(elementStyle.borderLeft)
  + pxToNumber(elementStyle.borderRight)

  const containerInnerWidth = pxToNumber(containerStyle.width)
  - pxToNumber(containerStyle.paddingLeft)
  - pxToNumber(containerStyle.paddingRight)
  - pxToNumber(containerStyle.marginLeft)
  - pxToNumber(containerStyle.marginRight)
  - pxToNumber(containerStyle.borderLeft)
  - pxToNumber(containerStyle.borderRight)

  return elementFullWidth >= containerInnerWidth
}

export function calculateLayout(element: HTMLElement, container: HTMLElement) {
  if (isFlexLayout(container)) {
    return isFlexRowDirectionLayout(container) ? LayoutEnum.HORIZONTAL : LayoutEnum.VERTICAL
  }
  if (isGridLayout(container)) {
    const len = getGridTemplateColumnsLen(container)
    return len <= 1 ? LayoutEnum.VERTICAL : LayoutEnum.HORIZONTAL
  }
  if (
    isBlockLayout(element)
    || isFlexLayout(element)
    || isGridLayout(element)
    || isTableLayout(element)
    || widthIsFullContainer(element, container)
  ) {
    return LayoutEnum.VERTICAL
  }

  return LayoutEnum.HORIZONTAL
}
