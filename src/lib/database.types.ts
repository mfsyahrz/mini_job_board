export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type JobType = 'Full-Time' | 'Part-Time' | 'Contract';

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: number
          user_id: string
          title: string
          company: string
          description: string
          location: string
          type: JobType
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          title: string
          company: string
          description: string
          location: string
          type: JobType
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          title?: string
          company?: string
          description?: string
          location?: string
          type?: JobType
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 