// 自定义ReactDOM
import { instantiate } from './instance'

export default class ReactDOM {
  static render(element, container) {
    // console.log('触发了render', element, container)
    const controller = instantiate(element)
    const domElement = controller.mount()
    container.appendChild(domElement)
  }
}
