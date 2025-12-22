import { boardService } from '@/lib/services/board.service'
import { AppError } from '@/lib/errors/app-error'

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const board = await boardService.findById({
      boardId: params.id,
    })
    return Response.json({ success: true, data: board })
  } catch (err) {
    if (err instanceof AppError) {
      return Response.json(
        { success: false, error: err.message, code: err.code },
        { status: err.status },
      )
    }
    console.error('Get board route crashed', err)

    return Response.json(
      { success: false, error: 'something went wrong' },
      { status: 500 },
    )
  }
}
