import { emitToRoom } from './rooms'
import { BoardEvent } from '@/lib/types/board-event.type'

export function emitBoardEvent(event: BoardEvent) {
  emitToRoom(`board:${event.boardId}`, event)
}
