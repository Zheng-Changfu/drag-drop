import type { DragDropPluginCtx, DrapDropEventsCallback, EnhancedMouseEvent, MaybeBoolOrFunc } from '@drag-drop/core'
import type { CSSProperties, VNodeChild } from 'vue'
import { computed, ref, unref } from 'vue'
import { getBoundingClientRect, isBool, isFunc } from '@drag-drop/shared'
import { calculateLayout, calculateXLocation, calculateYLocation, getMouseAfterElement, getMouseBeforeElement, isElementNode, isInThresholdRange, numberToPx } from './helpers'
import { type AuxiliaryLineLocation, DirectionEnum, LayoutEnum } from './types'

const buildInMethods: Required<Pick<AuxiliaryLinePluginOptions, 'getElementChildrenAndContainer' | 'getTargetElementByEvent' | 'onRender'>> = {
  onRender(location, style) {
    if (!location || location.direction === DirectionEnum.IN) return null
    return <div style={style}></div>
  },
  getTargetElementByEvent: event => event.target!,
  getElementChildrenAndContainer: (element, inThresholdRange) => {
    if (inThresholdRange) {
      return {
        container: element,
        children: Array.from(element.childNodes).filter(isElementNode) as HTMLElement[],
      }
    }

    return {
      container: element.parentElement!,
      children: Array.from(element.parentElement!.childNodes).filter(isElementNode) as HTMLElement[],
    }
  },
}

interface AuxiliaryLinePluginOptions {
  thresholdSize?: number
  auxiliaryLineSize?: number
  onEnd?: DrapDropEventsCallback['onEnd']
  onMove?: DrapDropEventsCallback['onMove']
  onStart?: DrapDropEventsCallback['onStart']
  getTargetElementByEvent?: (event: EnhancedMouseEvent) => HTMLElement
  showAuxiliaryLine?: MaybeBoolOrFunc<(event: EnhancedMouseEvent) => boolean>
  onRender?: (location: AuxiliaryLineLocation | undefined, style: Record<string, any>) => VNodeChild
  getElementChildrenAndContainer?: (element: HTMLElement, inThresholdRange: boolean) => { children: HTMLElement[]; container: HTMLElement }
}

export function auxiliaryLinePlugin(options: AuxiliaryLinePluginOptions = {}) {
  return function ({ context }: DragDropPluginCtx) {
    const {
      onEnd,
      onMove,
      onStart,
      thresholdSize = 8,
      auxiliaryLineSize = 2,
      showAuxiliaryLine = true,
      onRender = buildInMethods.onRender,
      getTargetElementByEvent = buildInMethods.getTargetElementByEvent,
      getElementChildrenAndContainer = buildInMethods.getElementChildrenAndContainer,
    } = options

    const auxiliaryLineLocationRef = ref<AuxiliaryLineLocation>()

    function getShowAuxiliaryLine(event: EnhancedMouseEvent) {
      if (isBool(showAuxiliaryLine)) return showAuxiliaryLine
      if (isFunc(showAuxiliaryLine)) return showAuxiliaryLine(event)
      return true
    }

    function calculateAuxiliaryLineLocation(event: EnhancedMouseEvent): AuxiliaryLineLocation {
      const element = getTargetElementByEvent(event)
      const inThresholdRange = isInThresholdRange(element, event, thresholdSize)
      const { container, children } = getElementChildrenAndContainer(element, inThresholdRange)

      if (children.length <= 0) {
        return {
          event,
          element,
          direction: DirectionEnum.IN,
        }
      }
      const firstElement = children[0]
      const layout = calculateLayout(firstElement, container)
      let afterMouseElement = getMouseAfterElement(children, event, layout)
      let beforeMouseElement = getMouseBeforeElement(children, event, layout)

      if (!afterMouseElement) afterMouseElement = beforeMouseElement
      if (!beforeMouseElement) beforeMouseElement = afterMouseElement

      return layout === LayoutEnum.HORIZONTAL
        ? calculateXLocation(beforeMouseElement!, afterMouseElement!, event)
        : calculateYLocation(beforeMouseElement!, afterMouseElement!, event)
    }

    context.onStart((event) => {
      onStart?.(event)
    })

    context.onMove((event) => {
      if (!getShowAuxiliaryLine(event)) return
      const auxiliaryLineLocation = calculateAuxiliaryLineLocation(event)
      auxiliaryLineLocationRef.value = auxiliaryLineLocation
      onMove?.(event)
    })

    context.onEnd((event) => {
      onEnd?.(event)
      auxiliaryLineLocationRef.value = undefined
    })

    const styleGetter = computed(() => {
      const location = unref(auxiliaryLineLocationRef)
      const basicStyle: CSSProperties = {
        position: 'fixed',
        background: '#0071e7',
        pointerEvents: 'none',
        zIndex: 'auto',
      }

      if (location && location.direction !== DirectionEnum.IN) {
        const { direction, element, event } = location
        let { left, top, right, bottom, width, height } = getBoundingClientRect(element)

        if (event.inIframe) {
          const { left: offsetLeft, top: offsetTop } = getBoundingClientRect(event.iframe)
          left += offsetLeft
          right += offsetLeft
          top += offsetTop
          bottom += offsetTop
        }

        const rectStyle = {
          [DirectionEnum.LEFT]: { width: numberToPx(auxiliaryLineSize) },
          [DirectionEnum.TOP]: { height: numberToPx(auxiliaryLineSize) },
          [DirectionEnum.RIGHT]: { width: numberToPx(auxiliaryLineSize), left: numberToPx(right) },
          [DirectionEnum.BOTTOM]: { height: numberToPx(auxiliaryLineSize), top: numberToPx(bottom) },
        }[direction]

        return {
          ...{
            left: numberToPx(left),
            top: numberToPx(top),
            width: numberToPx(width),
            height: numberToPx(height),
            ...rectStyle,
          },
          ...basicStyle,
        }
      }

      return basicStyle
    })

    return () => {
      const style = unref(styleGetter)
      const location = unref(auxiliaryLineLocationRef)
      return onRender(location, style)
    }
  }
}
