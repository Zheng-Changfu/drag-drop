## Api
```typescript
// 基本使用
const context = useDrag({
  canDraggable:(element,event) => boolean // 是否可以拖拽,默认为 true
  canDropable:(element,event) => boolean // 是否可以放置,默认为 true
})

 // 获取是否可以拖拽的 hook
const canDropable = context.useCanDropable()
// 获取是否可以放置的 hook
const canDraggable = context.useCanDraggable() 

/**
 *  应用插件,插件是一个函数
 *  destory:卸载插件(因为瓜姐开发 canDrop 的时候)
 *  mount:挂载插件
 *  exposed:插件暴露的数据
 */
const {destory,mount,exposed} = context.use(fnPlugin())

/**
 * 在拖拽流程中,鼠标按下时的 hook, 
 * event:鼠标按下时的event
 * element:鼠标按下时的element
 * onStart:鼠标按下时的回调函数,example: onStart(() =>{xxxx})
 * 拖拽流程结束后 event 为空，element为空，
 */
const {event,element,onStart} = context.useMouseDown() 

/**
 * 在拖拽流程中,拖拽移动时的 hook, 
 * event:拖拽移动时的event
 * element:拖拽移动时的element
 * onMove:拖拽移动时的回调函数,example: onMove(() =>{xxxx})
 * 拖拽流程结束后 event 为空，element为空，
 */
const {event,element,onMove} = context.useMouseMove()

/**
 * 在拖拽流程中,鼠标抬起时的 hook, 
 * event:鼠标抬起时的event
 * element:鼠标抬起时的element
 * onEnd:拖拽移动时的回调函数,example: onEnd(() =>{xxxx})
 * 拖拽流程结束后 event 为空，element为空，
 */
const {event,element,onEnd} = context.useMouseUp()

/**
 * 在拖拽流程中触发时的 hook, 
 * isDragging:是否在拖拽中
 * onDragging:拖拽流程时的回调函数,example: onDragging(() =>{xxxx})
 * 拖拽流程结束后 isDragging 为 false
 */
const {event,isDragging,onDragging} = context.useDragging()

```
