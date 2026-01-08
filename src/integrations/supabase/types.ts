export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          ai_response: string
          id: string
          lead_id: string | null
          sent_at: string
          session_date: string
          user_email: string
          user_message: string
          user_name: string
          webinar_id: string
        }
        Insert: {
          ai_response: string
          id?: string
          lead_id?: string | null
          sent_at?: string
          session_date?: string
          user_email: string
          user_message: string
          user_name: string
          webinar_id: string
        }
        Update: {
          ai_response?: string
          id?: string
          lead_id?: string | null
          sent_at?: string
          session_date?: string
          user_email?: string
          user_message?: string
          user_name?: string
          webinar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      cta_clicks: {
        Row: {
          button_text: string | null
          button_url: string | null
          clicked_at: string
          id: string
          lead_id: string | null
          minutes_watched: number
          webinar_id: string
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          clicked_at?: string
          id?: string
          lead_id?: string | null
          minutes_watched?: number
          webinar_id: string
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          clicked_at?: string
          id?: string
          lead_id?: string | null
          minutes_watched?: number
          webinar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cta_clicks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cta_clicks_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          captured_at: string
          email: string
          id: string
          ip_address: string | null
          name: string
          user_agent: string | null
          webinar_id: string
        }
        Insert: {
          captured_at?: string
          email: string
          id?: string
          ip_address?: string | null
          name: string
          user_agent?: string | null
          webinar_id: string
        }
        Update: {
          captured_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          name?: string
          user_agent?: string | null
          webinar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_events: {
        Row: {
          chat_message: string | null
          created_at: string
          cta_url: string | null
          device_type: string | null
          event_type: string
          id: string
          session_id: string | null
          user_email: string
          user_name: string | null
          watch_minutes: number | null
          watch_percent: number | null
          webinar_id: string
          webinar_name: string | null
        }
        Insert: {
          chat_message?: string | null
          created_at?: string
          cta_url?: string | null
          device_type?: string | null
          event_type: string
          id?: string
          session_id?: string | null
          user_email: string
          user_name?: string | null
          watch_minutes?: number | null
          watch_percent?: number | null
          webinar_id: string
          webinar_name?: string | null
        }
        Update: {
          chat_message?: string | null
          created_at?: string
          cta_url?: string | null
          device_type?: string | null
          event_type?: string
          id?: string
          session_id?: string | null
          user_email?: string
          user_name?: string | null
          watch_minutes?: number | null
          watch_percent?: number | null
          webinar_id?: string
          webinar_name?: string | null
        }
        Relationships: []
      }
      webinars: {
        Row: {
          background_color: string
          bot_avatar: string
          bot_name: string
          chat_background: string
          created_at: string
          cta_button_color: string
          cta_button_text: string
          cta_button_url: string
          cta_headline: string
          cta_show_after_minutes: number
          cta_show_urgency: boolean
          cta_style: string
          cta_subheadline: string
          cta_urgency_text: string
          duration_minutes: number
          enable_cta: boolean
          enable_lead_capture: boolean
          error_message: string
          header_title: string
          id: string
          lead_webhook_url: string
          logo_text: string
          max_viewers: number
          min_viewers: number
          primary_color: string
          require_email: boolean
          require_name: boolean
          start_hour: number
          start_minute: number
          timezone: string
          typing_delay_max: number
          typing_delay_min: number
          updated_at: string
          user_id: string | null
          video_url: string
          webhook_url: string
          webinar_name: string
          welcome_message: string
        }
        Insert: {
          background_color?: string
          bot_avatar?: string
          bot_name?: string
          chat_background?: string
          created_at?: string
          cta_button_color?: string
          cta_button_text?: string
          cta_button_url?: string
          cta_headline?: string
          cta_show_after_minutes?: number
          cta_show_urgency?: boolean
          cta_style?: string
          cta_subheadline?: string
          cta_urgency_text?: string
          duration_minutes?: number
          enable_cta?: boolean
          enable_lead_capture?: boolean
          error_message?: string
          header_title?: string
          id?: string
          lead_webhook_url?: string
          logo_text?: string
          max_viewers?: number
          min_viewers?: number
          primary_color?: string
          require_email?: boolean
          require_name?: boolean
          start_hour?: number
          start_minute?: number
          timezone?: string
          typing_delay_max?: number
          typing_delay_min?: number
          updated_at?: string
          user_id?: string | null
          video_url?: string
          webhook_url?: string
          webinar_name: string
          welcome_message?: string
        }
        Update: {
          background_color?: string
          bot_avatar?: string
          bot_name?: string
          chat_background?: string
          created_at?: string
          cta_button_color?: string
          cta_button_text?: string
          cta_button_url?: string
          cta_headline?: string
          cta_show_after_minutes?: number
          cta_show_urgency?: boolean
          cta_style?: string
          cta_subheadline?: string
          cta_urgency_text?: string
          duration_minutes?: number
          enable_cta?: boolean
          enable_lead_capture?: boolean
          error_message?: string
          header_title?: string
          id?: string
          lead_webhook_url?: string
          logo_text?: string
          max_viewers?: number
          min_viewers?: number
          primary_color?: string
          require_email?: boolean
          require_name?: boolean
          start_hour?: number
          start_minute?: number
          timezone?: string
          typing_delay_max?: number
          typing_delay_min?: number
          updated_at?: string
          user_id?: string | null
          video_url?: string
          webhook_url?: string
          webinar_name?: string
          welcome_message?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
