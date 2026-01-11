export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string
          updated_at: string | null
          logo_text: string | null
          logo_url: string | null
          display_name: string | null
          badge_text: string | null
          hero_title: string | null
          short_description: string | null
          detailed_bio: string | null
          avatar_url: string | null
          resume_url: string | null
          address: string | null
          footer_text: string | null
          privacy_content: string | null
          terms_content: string | null
          social_links: Json | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          logo_text?: string | null
          logo_url?: string | null
          display_name?: string | null
          badge_text?: string | null
          hero_title?: string | null
          short_description?: string | null
          detailed_bio?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          address?: string | null
          footer_text?: string | null
          privacy_content?: string | null
          terms_content?: string | null
          social_links?: Json | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          logo_text?: string | null
          logo_url?: string | null
          display_name?: string | null
          badge_text?: string | null
          hero_title?: string | null
          short_description?: string | null
          detailed_bio?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          address?: string | null
          footer_text?: string | null
          privacy_content?: string | null
          terms_content?: string | null
          social_links?: Json | null
        }
      }
      projects: {
        Row: {
          id: number
          user_id: string | null
          created_at: string | null
          title: string
          slug: string | null
          short_description: string | null
          content: string | null
          images: string[] | null
          tech_stack: string[] | null
          tags: string[] | null
          demo_url: string | null
          repo_url: string | null
          is_featured: boolean | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          title: string
          slug?: string | null
          short_description?: string | null
          content?: string | null
          images?: string[] | null
          tech_stack?: string[] | null
          tags?: string[] | null
          demo_url?: string | null
          repo_url?: string | null
          is_featured?: boolean | null
        }
        Update: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          title?: string
          slug?: string | null
          short_description?: string | null
          content?: string | null
          images?: string[] | null
          tech_stack?: string[] | null
          tags?: string[] | null
          demo_url?: string | null
          repo_url?: string | null
          is_featured?: boolean | null
        }
      }
      blogs: {
        Row: {
          id: number
          user_id: string | null
          created_at: string | null
          published_at: string | null
          title: string
          slug: string | null
          excerpt: string | null
          content: string | null
          images: string[] | null
          tags: string[] | null
          is_featured: boolean | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          published_at?: string | null
          title: string
          slug?: string | null
          excerpt?: string | null
          content?: string | null
          images?: string[] | null
          tags?: string[] | null
          is_featured?: boolean | null
        }
        Update: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          published_at?: string | null
          title?: string
          slug?: string | null
          excerpt?: string | null
          content?: string | null
          images?: string[] | null
          tags?: string[] | null
          is_featured?: boolean | null
        }
      }
      resume: {
        Row: {
          id: number
          user_id: string | null
          type: string
          title: string
          institution: string | null
          period: string | null
          description: string | null
          gpa: string | null
          tags: string[] | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          type: string
          title: string
          institution?: string | null
          period?: string | null
          description?: string | null
          gpa?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: number
          user_id?: string | null
          type?: string
          title?: string
          institution?: string | null
          period?: string | null
          description?: string | null
          gpa?: string | null
          tags?: string[] | null
        }
      }
      services: {
        Row: {
          id: number
          user_id: string | null
          title: string
          description: string | null
          icon_name: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          title: string
          description?: string | null
          icon_name?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          title?: string
          description?: string | null
          icon_name?: string | null
        }
      }
      messages: {
        Row: {
          id: number
          created_at: string | null
          name: string
          email: string
          message: string
          is_read: boolean | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          name: string
          email: string
          message: string
          is_read?: boolean | null
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string
          email?: string
          message?: string
          is_read?: boolean | null
        }
      }
      certificates: {
        Row: {
          id: number
          user_id: string | null
          title: string
          description: string | null
          issued_by: string | null
          issued_date: string | null
          expiry_date: string | null
          credential_url: string | null
          file_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          title: string
          description?: string | null
          issued_by?: string | null
          issued_date?: string | null
          expiry_date?: string | null
          credential_url?: string | null
          file_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          title?: string
          description?: string | null
          issued_by?: string | null
          issued_date?: string | null
          expiry_date?: string | null
          credential_url?: string | null
          file_url?: string | null
          created_at?: string | null
        }
      }
      tech_stack: {
        Row: {
          id: number
          user_id: string | null
          name: string
          icon_url: string | null
          category: string | null
          created_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          name: string
          icon_url?: string | null
          category?: string | null
          created_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          name?: string
          icon_url?: string | null
          category?: string | null
          created_at?: string | null
        }
      }
      blog_comments: {
        Row: {
          id: number
          blog_id: number | null
          name: string
          content: string
          created_at: string | null
        }
        Insert: {
          id?: number
          blog_id?: number | null
          name: string
          content: string
          created_at?: string | null
        }
        Update: {
          id?: number
          blog_id?: number | null
          name?: string
          content?: string
          created_at?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for use in components
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Export specific table types for convenience
export type Profile = Tables<'profile'>
export type Project = Tables<'projects'>
export type Blog = Tables<'blogs'>
export type Resume = Tables<'resume'>
export type Service = Tables<'services'>
export type Message = Tables<'messages'>
export type Certificate = Tables<'certificates'>
export type TechStack = Tables<'tech_stack'>
export type BlogComment = Tables<'blog_comments'>

// Social links type
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  website?: string;
  phone?: string;
  [key: string]: string | undefined;
}
