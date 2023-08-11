# some ideas
```typescript
import { createDraggable,createDropable,connect } from '@reactive-drag/core'

const [useDraggable1,useDropable1] = useReactiveDrag()
const [useDraggable2,useDropable2] = useReactiveDrag()
const [useDraggable3,useDropable3] = useReactiveDrag()

const treeDraggable = createDraggable()
const canvasDraggable = createDraggable()
const materielDraggable = createDraggable()

const canvasDropable = createDropable()
const treeDropable = createDropable()

connect(materielDraggable,canvasDropable) // materiel to canvas
connect(materielDraggable,treeDropable) // materiel to tree
connect(canvasDraggable,canvasDropable) // canvas to canvas
connect(treeDraggable,canvasDropable) // tree to canvas
```
