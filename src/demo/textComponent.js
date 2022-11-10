export default class TextComponent {
  constructor(element) {
    this.text = element
  }

  mount() {
    // 返回创建好的文本节点
    this.createElement()
    // console.log(this.node)
    return this.node
  }

  receive(nextElement) {
    // 差量更新
    this.text = nextElement
    this.node.textContent = this.text
  }

  getHostNode() {
    return this.node
  }

  unmount() {
    this.node = null
  }

  createElement() {
    this.node = document.createTextNode(this.text)
  }
}
