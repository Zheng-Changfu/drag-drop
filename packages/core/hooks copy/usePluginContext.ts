import type { AnyFn } from '@reactive-drag/shared'
import { genId, isFunc, noop } from '@reactive-drag/shared'
import type { Ref } from 'vue'
import { Fragment, h, onScopeDispose, ref, render, unref, watch } from 'vue'
import type { Plugin, UseReactionDragContext } from './types'

let el: HTMLElement
function createPluginElement() {
  if (el) return el
  const element = document.createElement('div')
  element.style.position = 'fixed'
  element.style.left = '0'
  element.style.top = '0'
  element.style.zIndex = '999'
  el = element
  document.body.appendChild(el)
  return element
}

interface PluginOption {
  plugin: Plugin
  context: UseReactionDragContext
  isActive: Ref<boolean>
}

export function usePluginContext() {
  const installedPlugins = ref<Set<PluginOption>>(new Set())

  function isActivePlugin(pluginOption: PluginOption) {
    return unref(pluginOption.isActive)
  }

  function pause(pluginOption: PluginOption) {
    pluginOption.isActive.value = false
  }

  function resume(pluginOption: PluginOption) {
    pluginOption.isActive.value = true
  }

  function checkInstalled(plugin: Plugin) {
    const plugins = Array.from(unref(installedPlugins))
    return !!plugins.find(item => item.plugin === plugin)
  }

  function use(plugin: Plugin, context: UseReactionDragContext) {
    if (!isFunc(plugin)) {
      throw new Error('plugin must be function')
    }

    if (checkInstalled(plugin)) {
      console.warn('plugin is installed')
      return
    }

    const pluginOption: PluginOption = {
      plugin,
      context,
      isActive: ref(true),
    }

    installedPlugins.value.add(pluginOption)

    return {
      pause: () => pause(pluginOption),
      resume: () => resume(pluginOption),
    }
  }

  function castPluginToComponent(plugin: Plugin, context: UseReactionDragContext) {
    return {
      name: plugin?.name ?? `Component${genId()}`,
      setup() {
        const cleanups: AnyFn[] = []

        function onDragging(fn: AnyFn) {
          const { off } = context.onDragging(fn)
          cleanups.push(off)
        }

        function onStart(fn: AnyFn) {
          const { off } = context.onStart(fn)
          cleanups.push(off)
        }

        function onMove(fn: AnyFn) {
          const { off } = context.onMove(fn)
          cleanups.push(off)
        }

        function onEnd(fn: AnyFn) {
          const { off } = context.onEnd(fn)
          cleanups.push(off)
        }

        onScopeDispose(() => {
          cleanups.forEach(fn => fn())
          cleanups.length = 0
        })

        const renderFunc = plugin({
          ...context,
          onDragging,
          onStart,
          onMove,
          onEnd,
        })
        return isFunc(renderFunc) ? renderFunc : noop
      },
    }
  }

  watch(installedPlugins, () => {
    const plugins = Array.from(unref(installedPlugins))
    const element = createPluginElement()
    const activePlugins = plugins.filter(isActivePlugin)
    const vnodes = activePlugins.map(opt => h(castPluginToComponent(opt.plugin, opt.context)))
    render(h(Fragment, vnodes), element)
  }, { deep: true })

  return {
    use,
  }
}
