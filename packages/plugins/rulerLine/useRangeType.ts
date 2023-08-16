import { useMouse } from '@reactive-drag/shared'
import { type MaybeRefOrGetter, ref, toValue, watch } from 'vue'

export enum RangeTypeEnum {
  OUT = 'OUT', // 范围外
  IN_NARROW = 'IN_NARROW', // 缩小的范围内,不在阈值范围
  IN_THRESHOLD = 'IN_THRESHOLD', // 阈值范围
}

interface UseRangeTypeOptions {
  element: MaybeRefOrGetter<HTMLElement | null | undefined> // 判断的元素
  thresholdSize: number // 阈值大小
}
export function useRangeType(options: UseRangeTypeOptions) {
  const { element, thresholdSize } = options
  const { x, y } = useMouse({ type: 'client' })
  const rangeTypeRef = ref<`${RangeTypeEnum}`>()

  watch([x, y, element], () => {
    const el = toValue(element)
    if (!el) {
      return
    }
    console.log(3)
  })

  return rangeTypeRef
}
