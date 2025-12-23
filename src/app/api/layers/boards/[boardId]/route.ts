import { layerService } from '@/lib/services/layer.service'
import { AppError } from '@/lib/errors/app-error'

export async function GET(
  req: Request,
  { params }: { params: { boardId: string } },
) {
  try {
    const layers = await layerService.listByBoard({
      boardId: params.boardId,
    })

    return Response.json({ success: true, data: layers })
  } catch (err) {
    if (err instanceof AppError) {
      return Response.json(
        { success: false, error: err.message, code: err.code },
        { status: err.status },
      )
    }

    console.error('Get list layers by id crashed', err)

    return Response.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 },
    )
  }
}
