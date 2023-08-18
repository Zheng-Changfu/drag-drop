import { type AnyFn, isFunc, noop } from '@drag-drop/shared'
import { Fragment, h, onScopeDispose, render } from 'vue'
import type { DragDropPlugin, UseDragDropContext } from '../types'

export class PluginScope {
  active = true
  exposed = {}
  constructor(public context: UseDragDropContext, public plugin: DragDropPlugin) {

  }

  castPluginToComponent() {
    return {
      setup: () => {
        const cleanups: AnyFn[] = []
        const context = this.context

        const onStart = (fn: AnyFn) => {
          const result = context.onStart((params) => {
            if (this.active) {
              fn(params)
            }
          })
          cleanups.push(result.off)
          return result
        }

        const onMove = (fn: AnyFn) => {
          const result = context.onMove((params) => {
            if (this.active) {
              fn(params)
            }
          })
          cleanups.push(result.off)
          return result
        }

        const onEnd = (fn: AnyFn) => {
          const result = context.onEnd((params) => {
            if (this.active) {
              fn(params)
            }
          })
          cleanups.push(result.off)
          return result
        }

        const onDragging = (fn: AnyFn) => {
          const result = context.onDragging((params) => {
            if (this.active) {
              fn(params)
            }
          })
          cleanups.push(result.off)
          return result
        }

        const ctx: UseDragDropContext = {
          ...context,
          onStart,
          onMove,
          onEnd,
          onDragging,
        }

        const render = this.plugin({ context: ctx, expose: this.expose.bind(this) })

        const _render = isFunc(render) ? render : noop

        onScopeDispose(() => {
          cleanups.forEach(fn => fn())
          cleanups.length = 0
        })

        return _render
      },
    }
  }

  pause() {
    this.active = false
  }

  resume() {
    this.active = true
  }

  expose(data: any) {
    this.exposed = data
  }
}

let pluginRootEl: HTMLElement
const installedPluginScopes = new Set<PluginScope>()

function createPluginRootElement() {
  if (pluginRootEl) return pluginRootEl
  const vnode = h('div', {
    style: {
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 'auto',
    },
  })
  render(vnode, document.body)
  pluginRootEl = vnode.el as any
  return pluginRootEl
}

function isRegisteredPlugin(plugin: DragDropPlugin) {
  return Array.from(installedPluginScopes).some(pluginScope => pluginScope.plugin === plugin)
}

function mount(el?: HTMLElement) {
  const root = el ?? createPluginRootElement()
  const vnodes = Array.from(installedPluginScopes).map((scope) => {
    const comp = scope.castPluginToComponent()
    const vnode = h(comp)
    return vnode
  })
  render(h(Fragment, vnodes), root)
}

export function use(context: UseDragDropContext, plugin: DragDropPlugin) {
  if (!isFunc(plugin)) {
    console.warn('plugin must be a function!')
    return
  }

  if (isRegisteredPlugin(plugin)) {
    console.warn('plugin has been registered!')
    return
  }

  const scope = new PluginScope(context, plugin)
  installedPluginScopes.add(scope)
  mount()

  return {
    use: context.use.bind(context),
    pause: scope.pause.bind(scope),
    resume: scope.resume.bind(scope),
    exposed: scope.exposed,
  }
}
