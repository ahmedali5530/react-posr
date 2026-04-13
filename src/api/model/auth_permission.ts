import {User} from "@/api/model/user.ts";

export interface AuthPermission {
  id: string
  token: string

  created_by: User
  created_at: Date

  approved_by?: User
  approved_at?: Date

  title: string
  payload?: any

  state: AuthState
}

export enum AuthState {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected'
}