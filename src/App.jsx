import React from 'react'
import UUID from 'uuid'

const colors = ['#A1887F', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA', '#00BCD4', '#00ACC1', '#0097A7', '#00838F', '#006064' ] 

const getKey = () => UUID.v4()

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [],
      loading: false
    }

    this.update = (list) => {
      const poses = Array.from({ length: 16 }).map((v, i) => i).filter(v => list.findIndex(l => l.pos === v) === -1)
      console.log(poses)
      const newG = { pos: 0, level: 0, key: getKey() }
      if (poses.length) {
        newG.pos = poses[Math.floor(Math.random() * poses.length)]
        this.setState({ list, loading: true }, () => {
          list.push(newG)
          setTimeout(() => this.setState({ list: list.filter(l => l.level > -1).sort((a, b) => a.key - b.key), loading: false }), 450)
        })
      }
    }

    this.up = () => {
      const list = [...this.state.list].filter(a => a.level > -1).sort((a, b) => a.pos - b.pos)
      for (let i = 0; i < list.length; i++) {
        let { level, pos, key } = list[i]
        console.log('map', level, pos)
        while (pos / 4 >= 1) { // should move or not
          const index = list.findIndex(x => x.pos === pos - 4)
          if (index === -1) { // no item in right
            pos -= 4
          } else {
            if (list[index].level === level) { // merge
              list[index].level += 1
              level = -100
              pos -= 4
            }
            break
          }
        }
        list[i] = { level, pos, key }
      }
      this.update(list)
    }

    this.down = () => {
      const list = [...this.state.list].filter(a => a.level > -1).sort((a, b) => b.pos - a.pos)
      for (let i = 0; i < list.length; i++) {
        let { level, pos, key } = list[i]
        console.log('map', level, pos)
        while (pos / 4 < 3) { // should move or not
          const index = list.findIndex(x => x.pos === pos + 4)
          if (index === -1) { // no item in right
            pos += 4
          } else {
            if (list[index].level === level) { // merge
              list[index].level += 1
              level = -100
              pos += 4
            }
            break
          }
        }
        list[i] = { level, pos, key }
      }
      this.update(list)
    }

    this.left = () => {
      const list = [...this.state.list].filter(a => a.level > -1).sort((a, b) => (a.pos % 4) - (b.pos % 4))
      for (let i = 0; i < list.length; i++) {
        let { level, pos, key } = list[i]
        console.log('map', level, pos)
        while (pos % 4 > 0) { // should move or not
          const index = list.findIndex(x => x.pos === pos - 1)
          if (index === -1) { // no item in right
            pos -= 1
          } else {
            if (list[index].level === level) { // merge
              list[index].level += 1
              level = -100
              pos -= 1
            }
            break
          }
        }
        list[i] = { level, pos, key }
      }
      this.update(list)
    }

    this.right = () => {
      const list = [...this.state.list].sort((a, b) => (b.pos % 4) - (a.pos % 4))
      for (let i = 0; i < list.length; i++) {
        let { level, pos, key } = list[i]
        console.log('map', level, pos)
        while (pos % 4 < 3) { // should move or not
          const index = list.findIndex(x => x.pos === pos + 1)
          if (index === -1) { // no item in right
            pos += 1
          } else {
            if (list[index].level === level) { // merge
              list[index].level += 1
              level = -100
              pos += 1
            }
            break
          }
        }
        list[i] = { level, pos, key }
      }
      this.update(list)
    }

    /* cathc key action */
    this.keyDown = (e) => {
      if (this.state.loading) return
      console.log(e.key)
      switch (e.key) {
        case 'ArrowUp':
          this.up()
          break
        case 'ArrowDown':
          this.down()
          break
        case 'ArrowLeft':
          this.left()
          break
        case 'ArrowRight':
          this.right()
          break
        default:
          break
      }
    }

    this.keyUp = e => null
  }

  componentDidMount() {
    /* bind keydown event */
    document.addEventListener('keydown', this.keyDown)
    document.addEventListener('keyup', this.keyUp)
    // this.update([{ pos: 0, level: 0, key: getKey() }])
    this.update([])
  }

  componentWillUnmount() {
    /* remove keydown event */
    document.removeEventListener('keydown', this.keyDown)
    document.removeEventListener('keyup', this.keyUp)
  }

  renderGrid({ pos, level, key }) {
    const color = colors[level + 1]
    const top = 8 + Math.floor(pos / 4) * 144
    const left = 8 + (pos % 4) * 144
    const text = level > -1 ? Math.pow(2, level) : ''
    return (
      <div
        key={key.toString()}
        style={{
          position: 'absolute',
          marginTop: top || 0,
          marginLeft: left || 0,
          width: 128,
          height: 128,
          backgroundColor: color,
          zIndex: level + 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 450ms'
        }}
      >
        { text }
      </div>
    )
  }

  render() {
    console.log('state', this.state.list)
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ width: 624, height: '100%', margin: 24 }}>
          <div style={{ fontSize: 34, fontWeight: 500, color: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              2048 AI
            </div>
          <div style={{ height: 48 }} />
          <div style={{ width: 576, height: 576, backgroundColor: '#795548', padding: 8, position: 'relative' }} key="container">
            { Array.from({ length: 16 }).map((v, i) => this.renderGrid({ level: -1, pos: i, key: getKey() })) }
            { this.state.list.map(l => this.renderGrid(l)) }
          </div>
        </div>
      </div>
    )
  }
}

export default App
