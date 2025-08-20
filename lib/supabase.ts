import { createClient } from '@supabase/supabase-js';
import { Database, Tables, Enums } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export type definitions for use in components
export type ItemCondition = Enums<'item_condition'>;
export type ItemStatus = Enums<'item_status'>;
export type Item = Tables<'items'>;
export type ItemInsert = Database['public']['Tables']['items']['Insert'];
export type ItemUpdate = Database['public']['Tables']['items']['Update'];

// Helper type for queries
export type ItemWithImages = Item & {
  images: string[];
};
