import { shapeService } from '@/lib/services/shape.service'
import { AppError } from '@/lib/errors/app-error'

export async function GET(
  req: Request,
  { params }: { params: { shapeId: string } },
) {
  try {
    const shape = await shapeService.findById({
      shapeId: params.shapeId,
    })

    return Response.json({ success: true, data: shape })
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

    console.error('Get shape by id route crashed', err)

    return Response.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    )
  }
}
