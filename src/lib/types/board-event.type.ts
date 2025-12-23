export type BoardEvent = {
  type:
    | 'board_updated'
    | 'board_removed'
    | 'board_member_created'
    | 'board_member_updated'
    | 'board_member_removed'
    | 'shape_created'
    | 'shape_updated'
    | 'shape_deleted'
    | 'snapshot_created'
    | 'user_joined'
    | 'user_left'
  boardId: string
  entityId?: string
  actorUserId: string
  timestamp: number
}
