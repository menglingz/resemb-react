// 控制类
import { InstanceMap } from './instanceMap'
import { instantiate } from './instance'

export default class CompositeComponent {
  constructor(element) {
    this.element = element
    this.component = element.type
    this.props = element.props
  }

  /**
   *完善一下React生命周期函数的支持，主要是React组件的几个声明周期：
   *componentWillMount
   *componentDidMount
   *componentWillUpdate
   *componentDidUpdate
   *componentWillReceiveProps
   */
  // 生命周期钩子
  execHook(name, ...args) {
    if (this.instance[name]) {
      this.instance[name].call(this.instance, ...args)
    }
  }

  getHostNode() {
    return this.renderedComponent.getHostNode()
  }

  // 挂载
  mount() {
    this.instantiate()
    // 挂载之前生命周期钩子
    this.execHook('componentWillMount')
    this.render()
    return this.toMount()
  }

  receive(nextElement) {
    this.execHook('componentWillReceiveProps', nextElement.props)
    // const prevProps = this.props
    this.element = nextElement
    this.props = nextElement.props
    this.component = nextElement.type
    // 更新组件的props
    this.instance.props = this.props
    // // 递归执行子组件更新
    // this.update({}, prevProps)
    // this.execHook('componentDidUpdate')
  }

  toMount() {
    // 递归执行mount
    let result = null
    if (this.renderedElement) {
      this.renderedComponent = instantiate(this.renderedElement)
      result = this.renderedComponent.mount()
    }
    // 挂载完成后生命周期钩子
    this.execHook('componentDidMount')
    return result
  }

  // 更新
  update(state, prevProps = this.props) {
    // 更新之前组件的状态
    const prevState = this.instance.state
    // 合并最新的状态
    const nextState = { ...this.instance.state, ...state }
    // 更新之前生命周期钩子
    this.execHook('componentWillUpdate', this.props, prevState)

    if (state) {
      // 更新state
      this.instance.state = nextState
    }

    const prevElement = this.renderedElement // 未更新前的结构树
    this.render() // 重新渲染
    const nextElement = this.renderedElement // 更新后的二结构树
    const nextProps = nextElement.props

    if (prevElement.type === nextElement.type) {
      // 元素类型一致，可以复用（增量更新）
      this.receive(nextElement)
      this.renderedComponent.receive(nextElement)
    } else {
      // 销毁重建
      const hostNode = this.getHostNode()
      this.unmount()
      const newNode = this.toMount()
      // 替换DOM节点（这里简便起见将更新DOM操作写在这里，理论上React组件和平台无关，应该依赖注入）
      hostNode.parentNode.replaceChild(newNode, hostNode)
    }

    // 更新之后生命周期钩子
    this.execHook('componentDidUpdate', nextProps, nextState)
  }

  unmount() {
    // 卸载
    this.execHook('componentWillUnmount')
    this.renderedComponent.unmount()
  }

  render() {
    if (this.instance) {
      // 如果是类组件，执行类组件的render方法
      this.renderedElement = this.instance.render()
      this.props = this.renderedElement.props
    } else {
      // 函数组件直接执行这个函数
      this.renderedElement = this.component(this.props)
    }
  }

  instantiate() {
    if (this.component.isClassComponent) {
      // 判断是否是类组件，类组件需要实例化
      this.instance = new this.component(this.props)
      InstanceMap.set(this.instance, this)
    } else {
      // 函数组件不需要实例化
      this.instance = null
    }
  }
}
