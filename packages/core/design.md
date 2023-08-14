# some ideas
```typescript
import { useReactionDrag } from '@reactive-drag/core'

const {pause,resume,use,id} = useReactionDrag({
  proxyTarget: .... // 绑定事件的代理目标，默认 document
  canDraggable: ... // 是否可以拖拽,默认 true，boolean | (element,event) => boolean
  canDropable: ... // 是否可以放置, 默认 true，boolean | （element,event) => boolean
})

const rulerLinePluginContext = use(rulerLinePlugin)
const dragNameDisplayPluginContext = use(dragNameDisplayPlugin)

rulerLinePluginContext.pause()
rulerLinePluginContext.resume()
```
