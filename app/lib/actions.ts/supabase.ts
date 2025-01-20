"use server";

import { createClient } from '@/app/lib/utils/supabase/server';
import { QueryData } from '@supabase/supabase-js';

export async function fetchFromSupabase(
  table: string,
  select: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  match: any
) {
  console.log('Enter fetchFromSupabase', table, select, match)
  const supabase = await createClient();
  const query = supabase.from(table).select(select).match(match);
  type ResultType = QueryData<typeof query>
  const { data, error } = await query;
  if (error) {
    throw new Error(error.message)
  }
  return data as ResultType
}

export async function updateRowSupabase(
  table: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateData: any,
  eqKey: string,
  eqValue: string
) {
  console.log('Enter updateRowSupabase', table, updateData, eqKey, eqValue)
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .update(updateData)
    .eq(eqKey, eqValue)
    .select()

  if (error) {
    throw new Error(error.message)
  }
  return data
}