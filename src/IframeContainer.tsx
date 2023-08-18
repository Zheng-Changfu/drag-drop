import { defineComponent, onMounted, ref, render, useSlots } from 'vue'

export const IframeContainer = defineComponent({
  setup() {
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
        <h1>Iframe容器...</h1>
        {renderSlots()}
      </div>

      render(vnode, body)
    })

    return () => {
      return <iframe ref={iframeElRef} ></iframe>
    }
  },
})
