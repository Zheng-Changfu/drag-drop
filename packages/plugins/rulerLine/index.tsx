import type { UseReactionDragContext } from '@reactive-drag/core'
import type { CSSProperties, MaybeRefOrGetter } from 'vue'
import { getGridTemplateColumns, isBlockLayout, isFlexLayout, isFlexRowLayout, isGridLayout, isTableLayout, isWidthFull } from './utils'

interface RulerLinePluginOptions {
  style?: MaybeRefOrGetter<CSSProperties>
  rulerSize?: number
  thresholdSize?: number
  startDetect?: boolean | ((element: HTMLElement) => boolean)
  onDetectLayout?: (element: HTMLElement, parentElement: HTMLElement) => `${DirectionEnum}`
}

export enum DirectionEnum {
  IN = 'IN',
  TOP = 'TOP',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
}

export enum LayoutEnum {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'Horizontal',
}

export function rulerLinePlugin(options: RulerLinePluginOptions) {
  return function (dragContext: UseReactionDragContext) {
    const { style = {}, rulerSize = 2, thresholdSize = 8, startDetect = true, onDetectLayout } = options
    const { onDragging } = dragContext

    /**
     * 1. 获取当前点位符合要求的元素
     * 2. 获取到该元素在父元素上的布局
     * 3.
     */

    function detectLayout(element: HTMLElement): `${LayoutEnum}` {
      const parentElement = element.parentElement!

      if (isFlexLayout(parentElement)) {
        return isFlexRowLayout(parentElement) ? LayoutEnum.HORIZONTAL : LayoutEnum.VERTICAL
      }
      if (isGridLayout(parentElement)) {
        return getGridTemplateColumns(parentElement) <= 1 ? LayoutEnum.VERTICAL : LayoutEnum.HORIZONTAL
      }
      if (
        isBlockLayout(element)
        || isFlexLayout(element)
        || isTableLayout(element)
        || isGridLayout(element)
        || isWidthFull(element, parentElement)
      ) {
        return LayoutEnum.VERTICAL
      }
      return LayoutEnum.HORIZONTAL
    }

    onDragging((event) => {

    })

    return () => {

    }
  }
}
