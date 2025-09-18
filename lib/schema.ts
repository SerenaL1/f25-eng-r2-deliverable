export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      comments: {
        Row: {
          author: string;
          content: string;
          created_at: string | null;
          id: number;
          species_id: number;
        };
        Insert: {
          author: string;
          content: string;
          created_at?: string | null;
          id?: number;
          species_id: number;
        };
        Update: {
          author?: string;
          content?: string;
          created_at?: string | null;
          id?: number;
          species_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "comments_author_fkey";
            columns: ["author"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_species_id_fkey";
            columns: ["species_id"];
            isOneToOne: false;
            referencedRelation: "species";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          biography: string | null;
          display_name: string;
          email: string;
          id: string;
        };
        Insert: {
          biography?: string | null;
          display_name: string;
          email: string;
          id: string;
        };
        Update: {
          biography?: string | null;
          display_name?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      species: {
        Row: {
          author: string;
          common_name: string | null;
          description: string | null;
          id: number;
          image: string | null;
          kingdom: Database["public"]["Enums"]["kingdom"];
          scientific_name: string;
          total_population: number | null;
        };
        Insert: {
          author: string;
          common_name?: string | null;
          description?: string | null;
          id?: number;
          image?: string | null;
          kingdom: Database["public"]["Enums"]["kingdom"];
          scientific_name: string;
          total_population?: number | null;
        };
        Update: {
          author?: string;
          common_name?: string | null;
          description?: string | null;
          id?: number;
          image?: string | null;
          kingdom?: Database["public"]["Enums"]["kingdom"];
          scientific_name?: string;
          total_population?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "species_author_fkey";
            columns: ["author"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      kingdom: "Animalia" | "Plantae" | "Fungi" | "Protista" | "Archaea" | "Bacteria";
    };
    CompositeTypes: Record<string, never>;
  };
}

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? TableName extends keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
        Row: infer R;
      }
      ? R
      : Record<string, unknown>
    : Record<string, unknown>
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : Record<string, unknown>
    : Record<string, unknown>;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? TableName extends keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I;
      }
      ? I
      : Record<string, unknown>
    : Record<string, unknown>
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : Record<string, unknown>
    : Record<string, unknown>;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? TableName extends keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U;
      }
      ? U
      : Record<string, unknown>
    : Record<string, unknown>
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : Record<string, unknown>
    : Record<string, unknown>;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? EnumName extends keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : never
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? CompositeTypeName extends keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : never
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
