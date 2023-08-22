import type { EnhancedMouseEvent } from '@drag-drop/core'
import { getBoundingClientRect } from '@drag-drop/shared'
import { DirectionEnum, LayoutEnum } from './types'
import type { AuxiliaryLineLocation } from './types'

export function getMouseBeforeElement(children: HTMLElement[], event: EnhancedMouseEvent, layout: `${LayoutEnum}`) {
  function isMouseBefore(element: HTMLElement) {
    const { x, y } = event.originEvent
    const { left, top } = getBoundingClientRect(element)
    if (layout === LayoutEnum.HORIZONTAL) {
      // 水平方向
      return x > left
    }
    // 垂直方向
    return y > top
  }

  for (let i = children.length - 1; i >= 0; i--) {
    const element = children[i]
    if (isMouseBefore(element)) {
      return element
    }
  }
}

export function getMouseAfterElement(children: HTMLElement[], event: EnhancedMouseEvent, layout: `${LayoutEnum}`) {
  function isMouseAfter(element: HTMLElement) {
    const { x, y } = event.originEvent
    const { left, top } = getBoundingClientRect(element)
    if (layout === LayoutEnum.HORIZONTAL) {
      return x <= left
    }
    return y <= top
  }

  for (let i = 0; i < children.length; i++) {
    const element = children[i]
    if (isMouseAfter(element)) {
      return element
    }
  }
}

export function isInThresholdRange(element: HTMLElement, event: EnhancedMouseEvent, thresholdSize: number) {
  const { x, y } = event.originEvent
  const { left, right, top, bottom } = getBoundingClientRect(element)
  const thresholdTop = top + thresholdSize
  const thresholdLeft = left + thresholdSize
  const thresholdRight = right - thresholdSize
  const thresholdBottom = bottom - thresholdSize
  const xIsInThresholdRange = x >= thresholdLeft && x <= thresholdRight
  const yIsInThresholdRange = y >= thresholdTop && y <= thresholdBottom
  return xIsInThresholdRange && yIsInThresholdRange
}

export function isElementNode(val: any) {
  return val && val.nodeType === 1
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

export function numberToPx(val: number) {
  return `${val}px`
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

export function calculateXLocation(beforeElement: HTMLElement, afterElement: HTMLElement, event: EnhancedMouseEvent): AuxiliaryLineLocation {
  const { x } = event.originEvent
  const { left: afterElementLeft, right: afterElementRight, width: afterElementWidth } = getBoundingClientRect(afterElement)
  const { left: beforeElementLeft, right: beforeElementRight, width: beforeElementWidth } = getBoundingClientRect(beforeElement)
  const xIsInAfterElementRange = x >= afterElementLeft && x <= afterElementRight
  const xIsInBeforeElementRange = x >= beforeElementLeft && x <= beforeElementRight

  if (xIsInAfterElementRange) {
    const isInLeftRange = x - (afterElementLeft + afterElementWidth / 2) < 0
    return {
      event,
      element: afterElement,
      direction: isInLeftRange ? DirectionEnum.LEFT : DirectionEnum.RIGHT,
    }
  }

  if (xIsInBeforeElementRange) {
    const isInLeftRange = x - (beforeElementLeft + beforeElementWidth / 2) < 0
    return {
      event,
      element: beforeElement,
      direction: isInLeftRange ? DirectionEnum.LEFT : DirectionEnum.RIGHT,
    }
  }

  // 鼠标在二个元素中间

  // 是否偏向beforeElement
  const isDeviationBeforeElement = Math.abs(x - beforeElementRight) - Math.abs(x - afterElementLeft) < 0
  return {
    event,
    element: isDeviationBeforeElement ? beforeElement : afterElement,
    direction: isDeviationBeforeElement ? DirectionEnum.RIGHT : DirectionEnum.LEFT,
  }
}

export function calculateYLocation(beforeElement: HTMLElement, afterElement: HTMLElement, event: EnhancedMouseEvent): AuxiliaryLineLocation {
  const { y } = event.originEvent
  const { top: afterElementTop, bottom: afterElementBottom, height: afterElementHeight } = getBoundingClientRect(afterElement)
  const { top: beforeElementTop, bottom: beforeElementBottom, height: beforeElementHeight } = getBoundingClientRect(beforeElement)
  const yIsInAfterElementRange = y >= afterElementTop && y <= afterElementBottom // 鼠标在后面元素范围内
  const yIsInBeforeElementRange = y >= beforeElementTop && y <= beforeElementBottom // 鼠标在前面元素范围

  if (yIsInAfterElementRange) {
    const isInTopRange = y - (afterElementTop + afterElementHeight / 2) < 0
    return {
      event,
      element: afterElement,
      direction: isInTopRange ? DirectionEnum.TOP : DirectionEnum.BOTTOM,
    }
  }

  if (yIsInBeforeElementRange) {
    const isInToptRange = y - (beforeElementTop + beforeElementHeight / 2) < 0
    return {
      event,
      element: beforeElement,
      direction: isInToptRange ? DirectionEnum.TOP : DirectionEnum.BOTTOM,
    }
  }

  // 鼠标在二个元素中间

  // 是否偏向beforeElement
  const isDeviationBeforeElement = Math.abs(y - beforeElementBottom) - Math.abs(y - afterElementTop) < 0
  return {
    event,
    element: isDeviationBeforeElement ? beforeElement : afterElement,
    direction: isDeviationBeforeElement ? DirectionEnum.BOTTOM : DirectionEnum.TOP,
  }
}
