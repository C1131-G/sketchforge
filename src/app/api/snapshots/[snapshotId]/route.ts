import { snapshotService } from '@/lib/services/snapshot.service'
import { AppError } from '@/lib/errors/app-error'

export async function GET(
  req: Request,
  { params }: { params: { snapshotId: string } },
) {
  try {
    const snapshot = await snapshotService.findById({
      snapshotId: params.snapshotId,
    })

    return Response.json({ success: true, data: snapshot })
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

    console.error('Get snapshot by id route crashed', err)

    return Response.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    )
  }
}
