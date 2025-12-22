import { boardService } from '@/lib/services/board.service'
import { AppError } from '@/lib/errors/app-error'

export async function GET() {
  try {
    const boards = await boardService.listOwnerBoards()
    return Response.json({ success: true, data: boards })
  } catch (err) {
    if (err instanceof AppError) {
      return Response.json(
        { success: false, error: err.message, code: err.code },
        { status: err.status },
      )
    }
    console.error('List boards route crashed', err)

    return Response.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    )
  }
}
