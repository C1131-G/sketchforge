import { shapeService } from '@/lib/services/shape.service'
import { AppError } from '@/lib/errors/app-error'

export async function GET(
  req: Request,
  { params }: { params: { boardId: string } },
) {
  try {
    const shapes = await shapeService.loadByBoard({
      boardId: params.boardId,
    })

    return Response.json({ success: true, data: shapes })
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

    console.error('Load shapes by board route crashed', err)

    return Response.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    )
  }
}
