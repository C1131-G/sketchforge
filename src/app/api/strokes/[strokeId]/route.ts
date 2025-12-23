import { strokeService } from '@/lib/services/stroke.service'
import { AppError } from '@/lib/errors/app-error'

export async function GET(
  req: Request,
  { params }: { params: { strokeId: string } },
) {
  try {
    const stroke = await strokeService.findById({
      strokeId: params.strokeId,
    })

    return Response.json({ success: true, data: stroke })
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

    console.error('Get stroke by id route crashed', err)

    return Response.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    )
  }
}
