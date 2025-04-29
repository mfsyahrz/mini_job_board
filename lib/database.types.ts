export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: number
          created_at: string
          title: string
          company: string
          location: string
          description: string
          salary_range: string | null
          requirements: string[]
          benefits: string[]
          application_url: string
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          company: string
          location: string
          description: string
          salary_range?: string | null
          requirements: string[]
          benefits: string[]
          application_url: string
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          company?: string
          location?: string
          description?: string
          salary_range?: string | null
          requirements?: string[]
          benefits?: string[]
          application_url?: string
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