<script setup lang="tsx">
import { computed, ref, unref } from 'vue'
import type { TreeOption } from 'naive-ui'
import type { EnhancedMouseEvent } from '@drag-drop/core'
import { useDragDrop } from '@drag-drop/core'
import { sortPlugin } from '@drag-drop/plugin-sort'

interface TreeItem {
  name: string
  id: string
  pid?: string
  children?: TreeItem[]
}

const dataRef = ref<TreeItem[]>([
  {
    name: '节点1',
    id: '1',
    children: [
      { name: '节点1-1', id: '1-1', pid: '1' },
      { name: '节点1-2', id: '1-2', pid: '1' },
      { name: '节点1-3', id: '1-3', pid: '1' },
      { name: '节点1-4', id: '1-4', pid: '1' },
    ],
  },
  {
    name: '节点2',
    id: '2',
    children: [
      { name: '节点2-1', id: '2-1' },
      {
        name: '节点2-2',
        id: '2-2',
        children: [
          { name: '节点2-2-1', id: '2-2-1', pid: '2-2' },
          { name: '节点2-2-2', id: '2-2-2', pid: '2-2' },
        ],
      },
    ],
  },
  { name: '节点3', id: '3' },
])

const uid2TreeItemMapGetter = computed(() => {
  const data = unref(dataRef)
  const map = new Map<string, TreeItem>()

  const traverse = (data: TreeItem[]) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const children = item.children
      const hasChildren = children && children.length > 0
      map.set(item.id, item)

      if (hasChildren) {
        traverse(children)
      }
    }
  }
  traverse(data)
  return map
})

function nodeProps(info: { option: TreeOption }) {
  return {
    uid: info.option.id,
    pid: info.option.pid,
  }
}

const context = useDragDrop()

const { pause, resume } = context.use(sortPlugin({
  sort,
  canDraggable(event) {
    // 只允许叶子节点拖拽，因为跨层级拖拽的交互不知道页面如何呈现，大家可以按需根据自己业务需求实现跨层级拖拽
    const target = event.target
    if (!target) return false
    if (!target.classList.contains('n-tree-node-content__text')) return false
    const parentElement = target.parentElement!
    const uid = parentElement.getAttribute('uid')
    const pid = parentElement.getAttribute('pid')
    return !!(uid && pid)
  },
}))

function getUidAndPidByEvent(event: EnhancedMouseEvent) {
  const target = event.target
  if (!target) return null
  const parentElement = target.parentElement
  if (!parentElement) return null
  const uid = parentElement.getAttribute('uid')
  const pid = parentElement.getAttribute('pid')
  if (!uid || !pid) return null
  return {
    uid,
    pid,
  }
}

function getNodeIndexInParent(node: TreeItem, parentNode: TreeItem) {
  const children = parentNode.children ?? []
  return children.findIndex(item => item.id === node.id)
}

function sort(startEvent: EnhancedMouseEvent, moveEvent: EnhancedMouseEvent) {
  const startNodeUidAndPid = getUidAndPidByEvent(startEvent)
  const targetNodeUidAndPid = getUidAndPidByEvent(moveEvent)
  if (!startNodeUidAndPid || !targetNodeUidAndPid) return
  const { uid: startNodeUid, pid: startNodePid } = startNodeUidAndPid
  const { uid: targetNodeUid, pid: targetNodePid } = targetNodeUidAndPid
  if (startNodeUid === targetNodeUid) return

  const treeMap = unref(uid2TreeItemMapGetter)
  const parentNode = treeMap.get(startNodePid)!
  const startNode = treeMap.get(startNodeUid)!
  const targetNode = treeMap.get(targetNodeUid)!
  const startNodeIndex = getNodeIndexInParent(startNode, parentNode)
  const targetNodeIndex = getNodeIndexInParent(targetNode, parentNode)

  if ((~startNodeIndex) && (~targetNodeIndex)) {
    // swap
    const nodes = parentNode.children!
    const tempNode = nodes[startNodeIndex]
    nodes[startNodeIndex] = nodes[targetNodeIndex]
    nodes[targetNodeIndex] = tempNode
  }
}
</script>

<template>
  <n-card>
    <n-tree
      default-expand-all
      :data="dataRef"
      :selectable="false"
      key-field="id"
      label-field="name"
      :node-props="nodeProps"
    />
  </n-card>
</template>

<style scoped>
:deep(.n-tree-node-content__text){
  user-select: none;
}
</style>
