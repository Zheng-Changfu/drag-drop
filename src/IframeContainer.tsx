import { TransitionGroup, defineComponent, onMounted, ref, render, unref, useSlots } from 'vue'

const isStyleTag = (el?: HTMLElement | Element) => el && el.tagName === 'STYLE'

export function iframeStyleSync(iframeWindow: Window) {
  function copyHeadStyleToIframeHead(resource?: Element) {
    const headChildList = window.document.head.children
    const iframeHead = iframeWindow.document.head

    if (headChildList && iframeHead) {
      if (resource && isStyleTag(resource)) {
        iframeHead.appendChild(resource.cloneNode(true))
        return
      }

      for (let i = 0; i < headChildList.length; i++) {
        const resource = headChildList[i]

        if (isStyleTag(resource)) {
          iframeHead.appendChild(resource.cloneNode(true))
        }
      }
    }
  }

  function watchHeadStyleAdded(fn: (nodes: NodeList) => void) {
    const observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        const addedNodes = mutation.addedNodes
        if (addedNodes.length > 0) {
          fn && fn(addedNodes)
        }
      })
    })

    observer.observe(window.document.head, {
      childList: true,
      attributeFilter: ['style'],
    })
  }

  function copy() {
    copyHeadStyleToIframeHead()
    watchHeadStyleAdded((resources) => {
      resources.forEach((resource: any) => copyHeadStyleToIframeHead(resource))
    })
  }

  copy()
}

export const IframeContainer = defineComponent({
  props: ['showTitle'],
  setup(props) {
    const slots = useSlots()
    const iframeElRef = ref<HTMLIFrameElement>()

    const renderSlots = () => {
      return Object.keys(slots).map((slotName) => {
        return (slots as any)[slotName]()
      })
    }

    onMounted(() => {
      const body = iframeElRef.value!.contentDocument!.body
      const vnode = <div>
        {props.showTitle !== false && <h1>Iframe容器...</h1>}
        <TransitionGroup tag="div" class="container" name="list" v-slots={slots}>
        </TransitionGroup>
      </div>

      render(vnode, body)
    })

    // 样式会被隔离，这里处理一下
    onMounted(() => {
      const iframeWindow = unref(iframeElRef)!.contentWindow!
      iframeStyleSync(iframeWindow)
    })

    return () => {
      return <iframe ref={iframeElRef}></iframe>
    }
  },
})
