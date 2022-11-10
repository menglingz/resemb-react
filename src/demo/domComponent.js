// dom控制类
import { instantiate } from './instance'
import EventListener from './event'

export default class DomComponent {
  constructor(element) {
    this.element = element
    // 节点类型
    this.tag = element.type
    // 节点属性
    this.props = element.props
    // console.log(this.element)
  }

  mount() {
    // 包装this.node  创建 --> 挂载属性（除children之外的属性）--> 渲染子节点
    this.createElement()
    this.setAttribute()
    this.mountChildren()
    return this.node
  }

  unmount() {
    this.childComponents.forEach((child) => {
      child.unmount()
    })
    this.node = null
  }

  formatChildren(children) {
    children = children || []
    if (!Array.isArray(children)) {
      children = [children]
    }
    return children
  }

  // 创建DOM节点
  createElement() {
    this.node = document.createElement(this.tag)
  }

  getHostNode() {
    return this.node
  }

  receive(nextElement) {
    // 差量更新
    // 更新属性
    this.updateAttribute(nextElement.props)
    this.updateChildren(nextElement.props)
    // 赋值新的属性
    this.element = nextElement
    this.tag = nextElement.type
    this.props = nextElement.props
  }

  updateAttribute(nextProps) {
    const prevProps = this.props
    // 更新新的属性
    Object.keys(nextProps).forEach((attribute) => {
      if (attribute !== 'children') {
        if (attribute === 'className') {
          this.node.setAttribute('class', this.props[attribute])
        } else if (EventListener.isEventAttribute(attribute)) {
          EventListener.remove(attribute, this.node)
          EventListener.listen(attribute, this.props[attribute], this.node)
        } else {
          this.node.setAttribute(attribute, this.props[attribute])
        }
      }
    })

    // 删除旧的属性
    Object.keys(prevProps).forEach((attribute) => {
      if (attribute !== 'children') {
        if (!nextProps.hasOwnProperty(attribute)) {
          this.node.removeAttribute(attribute)
        }
      }
    })
  }

  updateChildren(nextProps) {
    const prevChildren = this.formatChildren(this.props.children) // 旧的子节点
    const nextChildren = this.formatChildren(nextProps.children) // 新的子节点

    for (let i = 0; i < nextChildren.length; i++) {
      const prevChild = prevChildren[i]
      const nextChild = nextChildren[i]
      const prevComponent = this.childComponents[i]
      const nextComponent = instantiate(nextChild)

      if (!nextComponent) {
        continue
      }

      /* 
        简单实现diff（没有支持Key的优化）
        1.新节点直接插入（旧节点不存在）
        2.新旧节点替换（类型相同，递归receive，类型不同，销毁重建，replaceChild）
        3.旧节点删除
      */
      if (prevChild == null) {
        // 旧的child不存在，说明是新增的场景
        this.node.appendChild(nextComponent.mount())
      } else if (prevChild.type === nextChild.type) {
        // 相同类型的元素，可以复用
        prevComponent.receive(nextChild)
      } else {
        // 销毁重建
        const prevNode = prevComponent.getHostNode()
        prevComponent.unmount()
        this.node.replaceChild(nextComponent.mount(), prevNode)
      }
    }
  }

  // 渲染子节点
  mountChildren() {
    // 组件DOM结构根节点的子树
    const children = this.formatChildren(this.props.children)
    const nodeList = []
    const childComponents = []
    children.forEach((childElement) => {
      const component = instantiate(childElement)
      if (component) {
        childComponents.push(component)
      }
      // console.log(childElement) Click me 0
      // 挂载子节点,如果子节点还不是文本节点，继续递归走domComponent，如果子节点是文本节点，说明dom树已经递归到最后一步，这时走的是textComponent
      // console.log(typeof childElement) string number
      const node = component.mount() // 返回文本节点
      if (node) {
        nodeList.push(node)
      }
    })
    this.childComponents = childComponents
    // 添加文本节点
    nodeList.forEach((node) => {
      this.node.appendChild(node)
    })
  }

  // 设置节点的属性
  setAttribute() {
    Object.keys(this.props).forEach((attribute) => {
      // console.log(attribute)  onClick children
      if (attribute !== 'children') {
        if (attribute === 'className') {
          // 处理类名
          this.node.setAttribute('class', this.props[attribute])
        } else if (EventListener.isEventAttribute(attribute)) {
          // 判断事件类型
          // 注册监听事件
          // 相当不 button.addEventListener('click',handler)
          EventListener.listen(attribute, this.props[attribute], this.node)
        } else {
          // 处理其他属性
          this.node.setAttribute(attribute, this.props[attribute])
        }
      }
    })
  }
}
