export const EventMap = {
  onClick: 'click'
}

const callbackMap = new Map()

export default class EventListener {
  static isEventAttribute(attribute) {
    // console.log(attribute)
    return !!EventMap[attribute]
  }

  // 绑定事件
  static listen(attribute, callback, dom) {
    // 将onClick 转化为 click
    dom.addEventListener(EventMap[attribute], callback)
    // 注册完之后将处理事件整体存入哈希表
    if (!callbackMap.has(dom)) {
      callbackMap.set(dom, {})
    }
    callbackMap.get(dom)[attribute] = callback
  }

  // 解绑事件
  static remove(attribute, dom) {
    dom.removeEventListener(EventMap[attribute], callbackMap.get(dom)[attribute])
  }
}
