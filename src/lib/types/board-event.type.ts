export type BoardEvent = {
  type:
    | 'board_updated'
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
