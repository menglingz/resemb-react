import { Component } from './demo/react'

export default class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  handleClick = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  componentWillMount() {
    console.log('componentWillMount触发')
  }

  componentDidMount() {
    console.log('componentDidMount触发')
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('componentWillUpdate触发', nextProps, nextState)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate触发', prevProps, prevState)
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps触发', nextProps)
  }

  render() {
    return (
      <button onClick={this.handleClick} index="1">
        Click me : {this.state.count}
      </button>
    )
  }
}
