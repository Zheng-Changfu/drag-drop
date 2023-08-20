import type { Ref } from 'vue'
import { toValue, watch } from 'vue'
import { tryOnScopeDispose } from './tryOnScopeDispose'

type Fn = () => void

type MaybeArray<T> = T | T[]
type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)
type MaybeComputedElement<T = any> = MaybeRefOrGetter<T>

export function useEventListener<Event extends keyof WindowEventMap>(
  event: MaybeArray<Event>,
  listener: MaybeArray<(this: Window, event: WindowEventMap[Event]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn

export function useEventListener<Event extends keyof WindowEventMap>(
  target: Window,
  event: MaybeArray<Event>,
  listener: MaybeArray<(this: Window, event: WindowEventMap[Event]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn

export function useEventListener<Event extends keyof DocumentEventMap>(
  target: Document,
  event: MaybeArray<Event>,
  listener: MaybeArray<(this: Document, event: DocumentEventMap[Event]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn

export function useEventListener<Event extends keyof HTMLElementEventMap>(
  target: MaybeComputedElement,
  event: MaybeArray<Event>,
  listener: MaybeArray<(this: HTMLElement, event: HTMLElementEventMap[Event]) => any>,
  options?: boolean | AddEventListenerOptions
): Fn

export function useEventListener(...args: any[]) {
  let target: MaybeComputedElement | Window | Document
  let events: MaybeArray<string>
  let listeners: MaybeArray<Fn>
  let options: boolean | AddEventListenerOptions

  const noop = () => { }

  if (typeof args[0] === 'string' || Array.isArray(args[0])) {
    [events, listeners, options] = args
    target = window
  }
  else {
    [target, events, listeners, options] = args
  }

  if (!target) {
    return noop
  }

  if (!Array.isArray(events)) {
    events = [events]
  }

  if (!Array.isArray(listeners)) {
    listeners = [listeners]
  }

  const cleanups: Fn[] = []

  function register(el: any, event: string, listeners: any[], options: any) {
    return listeners.map((listener) => {
      el.addEventListener(event, listener, options)
      return () => {
        el.removeEventListener(event, listener, options)
      }
    })
  }

  const stopWatch = watch(() => toValue(target), (el) => {
    cleanup()
    if (!el) return
    cleanups.push(
      ...(events as string[]).flatMap(event => register(el, event, listeners as Fn[], options)),
    )
  }, { immediate: true, flush: 'post' })

  function cleanup() {
    cleanups.forEach(fn => fn())
    cleanups.length = 0
  }

  function stop() {
    stopWatch()
    cleanup()
  }

  tryOnScopeDispose(stop)

  return stop
}
