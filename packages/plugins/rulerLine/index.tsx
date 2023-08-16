import type { UseReactionDragContext } from '@reactive-drag/core'
import { type CSSProperties, type MaybeRefOrGetter } from 'vue'
import { getGridTemplateColumns, isBlockLayout, isFlexLayout, isFlexRowLayout, isGridLayout, isTableLayout, isWidthFull } from './utils'

type Nullable<T> = T | null

interface AnchorElements {
  target: Nullable<HTMLElement>
  beforeMouseElement: Nullable<HTMLElement>
  afterMouseElement: Nullable<HTMLElement>
}

// 数据
// 数据获取元素的方法
// 数据获取父数据的方法
// event获取元素的方法

interface RulerLinePluginOptions<T> {
  data: T[] // 数据源
  childrenField?: string // 子节点的字段,支持 a.b.c 形式,默认 "children"
  getElementByEvent: (event: MouseEvent) => Nullable<HTMLElement> // 根据 event 获取元素的方法
  getParentByDataItem: (item: T) => Nullable<HTMLElement> // 根据数据获取父数据的方法
  getElementByDataItem: (item: T) => Nullable<HTMLElement> // 根据数据获取元素的方法
  style?: MaybeRefOrGetter<CSSProperties> // 标尺线样式
  rulerSize?: number // 标尺线大小
  thresholdSize?: number // 阈值大小
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
  HORIZONTAL = 'HORIZONTAL',
}

export function rulerLinePlugin<T extends MaybeRefOrGetter<object>>(options: RulerLinePluginOptions<T>) {
  return function (dragContext: UseReactionDragContext) {
    const {
      data,
      style = {},
      rulerSize = 2,
      thresholdSize = 8,
      getElementByEvent,
      getParentByDataItem,
      getElementByDataItem,
    } = options
    const { onDragging } = dragContext

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

    function getMouseBeforeElement() {

    }

    function getMouseAfterElement() {

    }

    function getXDirection() {}

    function getYDirection() {}

    onDragging((event) => {
      const element = getElementByEvent(event)
    })

    return () => {

    }
  }
}
