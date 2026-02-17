import type { Database, Tables } from './supabase'

export type Profile = Tables<'profiles'>
export type Room = Tables<'rooms'>
export type Message = Tables<'messages'>
export type PrivateMessage = Tables<'private_messages'>
export type UserSettings = Tables<'user_settings'>
export type Block = Tables<'blocks'>

export type { Database }
