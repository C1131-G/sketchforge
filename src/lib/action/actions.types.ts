export type ActionResultType<T> =
  | { success: true; data: T }
  | { success: false; error: string }
