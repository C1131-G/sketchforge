import { boardMemberService } from '@/lib/services/board-member.service'
import { AppError } from '@/lib/errors/app-error'

export async function GET(
  req: Request,
  { params }: { params: { boardId: string } },
) {
  try {
    const members = await boardMemberService.listMembers({
      boardId: params.boardId,
    })
    return Response.json({ success: true, data: members })
  } catch (err) {
    if (err instanceof AppError) {
      return Response.json(
        { success: false, error: err.message, code: err.code },
        { status: err.status },
      )
    }

    console.error('List board members route crashed', err)

    return Response.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    )
  }
}
