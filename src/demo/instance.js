// 实例入口
import CompositeComponent from './compositeComponent'
import DomComponent from './domComponent'
import TextComponent from './textComponent'

export function instantiate(element) {
  // 实例化文本节点
  if (typeof element === 'string' || typeof element === 'number') {
    return new TextComponent(element)
  }
  // 实例化DOM节点树
  if (typeof element.type === 'string') {
    return new DomComponent(element)
  }
  // 实例化组件
  if (typeof element.type === 'object' || typeof element.type === 'function') {
    return new CompositeComponent(element)
  }
  return null
}
