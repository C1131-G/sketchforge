import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 3001 })

wss.on('connection', (socket) => {
  console.log('client connected')

  socket.on('message', (data) => {
    console.log('message', data)
  })

  socket.on('close', () => {
    console.log('client disconnected')
  })
})
