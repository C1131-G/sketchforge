import { boardService } from '@/lib/services/board.service'

export async function GET() {
  const boards = await boardService.listOwnerBoards()
  return Response.json(boards)
}
