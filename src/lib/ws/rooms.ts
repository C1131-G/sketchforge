import type WebSocket from 'ws'

const rooms = new Map<string, Set<WebSocket>>()

export function joinRoom(roomId: string, socket: WebSocket) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set())
  }
  rooms.get(roomId)!.add(socket)
}

export function leaveAllRooms(socket: WebSocket) {
  for (const sockets of rooms.values()) {
    sockets.delete(socket)
  }
}

export function emitToRoom(roomId: string, payload: unknown) {
  const sockets = rooms.get(roomId)
  if (!sockets) return

  const message = JSON.stringify(payload)

  for (const ws of sockets) {
    if (ws.readyState === ws.OPEN) {
      ws.send(message)
    }
  }
}
