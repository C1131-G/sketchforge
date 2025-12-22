import { boardService } from '@/lib/services/board.service'

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const board = await boardService.findById({
    boardId: params.id,
  })
  return Response.json(board)
}
