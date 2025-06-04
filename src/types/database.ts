
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string;
          project_url?: string;
          tags: string[];
          client_name?: string;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url: string;
          project_url?: string;
          tags: string[];
          client_name?: string;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string;
          project_url?: string;
          tags?: string[];
          client_name?: string;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          business: string;
          quote: string;
          rating?: number;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          business: string;
          quote: string;
          rating?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          business?: string;
          quote?: string;
          rating?: number;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone?: string;
          company?: string;
          message: string;
          status: 'new' | 'contacted' | 'converted' | 'closed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          company?: string;
          message: string;
          status?: 'new' | 'contacted' | 'converted' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
          message?: string;
          status?: 'new' | 'contacted' | 'converted' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone?: string;
          company: string;
          website_url?: string;
          project_status: 'inquiry' | 'planning' | 'development' | 'completed' | 'maintenance';
          package_type: 'starter' | 'plus' | 'pro' | 'custom';
          total_value?: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          company: string;
          website_url?: string;
          project_status?: 'inquiry' | 'planning' | 'development' | 'completed' | 'maintenance';
          package_type?: 'starter' | 'plus' | 'pro' | 'custom';
          total_value?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string;
          website_url?: string;
          project_status?: 'inquiry' | 'planning' | 'development' | 'completed' | 'maintenance';
          package_type?: 'starter' | 'plus' | 'pro' | 'custom';
          total_value?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Project = Database['public']['Tables']['projects']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type Contact = Database['public']['Tables']['contacts']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
