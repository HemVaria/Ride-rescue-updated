import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton client (use this in most client-side code)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          emergency_contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          emergency_contact?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          emergency_contact?: string | null
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          make: string
          model: string
          year: number
          license_plate: string
          color: string | null
          mileage: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          make: string
          model: string
          year: number
          license_plate: string
          color?: string | null
          mileage?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          make?: string
          model?: string
          year?: number
          license_plate?: string
          color?: string | null
          mileage?: number | null
          updated_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string | null
          service_type: string
          status: string
          location_lat: number
          location_lng: number
          location_address: string
          provider_id: string | null
          cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id?: string | null
          service_type: string
          status?: string
          location_lat: number
          location_lng: number
          location_address: string
          provider_id?: string | null
          cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string | null
          service_type?: string
          status?: string
          location_lat?: number
          location_lng?: number
          location_address?: string
          provider_id?: string | null
          cost?: number | null
          updated_at?: string
        }
      }
    }
  }
}
