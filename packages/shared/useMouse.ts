import type { MaybeRefOrGetter } from 'vue'
import { ref, toRefs } from 'vue'
import { useEventListener } from './useEventListener'

interface Position {
  x: number
  y: number
}

type UseMouseType = 'page' | 'client' | 'screen'
type UseMouseTypeGetter = (event: MouseEvent) => [x: number, y: number]

export interface UseMouseOptions {
  /**
   * @desc 监听的目标元素
   * @default "Window"
   */
  target?: MaybeRefOrGetter<Window | HTMLElement | null | undefined>

  /**
   * @desc 返回基于目标类型的坐标
   * @default "page"
   */
  type?: UseMouseType | UseMouseTypeGetter

  /**
   * @desc 初始的坐标值
   * @default "{x:0,y:0}"
   */
  initialValue?: Position
}

const buildInUseMouseTypeGetter: Record<UseMouseType, UseMouseTypeGetter> = {
  page: event => [event.pageX, event.pageY],
  client: event => [event.clientX, event.clientY],
  screen: event => [event.screenX, event.screenY],
}

export function useMouse(options: UseMouseOptions = {}) {
  const {
    target = window,
    type = 'page',
    initialValue = { x: 0, y: 0 },
  } = options

  const postionRef = ref(initialValue)
  const getter = typeof type === 'function'
    ? type
    : buildInUseMouseTypeGetter[type]

  function handleMouseMove(event: MouseEvent) {
    const [x, y] = getter(event)
    postionRef.value.x = x
    postionRef.value.y = y
  }

  useEventListener(target, ['mousemove', 'dragover'], handleMouseMove)

  return {
    ...toRefs(postionRef.value),
  }
}
export type UseMouseReturn = ReturnType<typeof useMouse>
