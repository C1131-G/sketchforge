import { strokeService } from '@/lib/services/stroke.service'
import { AppError } from '@/lib/errors/app-error'

export async function GET(
  req: Request,
  { params }: { params: { boardId: string } },
) {
  try {
    const strokes = await strokeService.listByBoard({
      boardId: params.boardId,
    })

    return Response.json({ success: true, data: strokes })
  } catch (err) {
    if (err instanceof AppError) {
      return Response.json(
        {
          success: false,
          error: err.message,
          code: err.code,
        },
        { status: err.status },
      )
    }

    console.error('List strokes by board route crashed', err)

    return Response.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    )
  }
}
