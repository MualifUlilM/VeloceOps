import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_TENANTS } from '@/lib/data';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: dbTenants, error } = await supabase.from('tenants').select('*');

    if (!error && dbTenants && dbTenants.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'supabase_postgres',
        count: dbTenants.length,
        tenants: dbTenants,
      });
    }
  } catch (err) {
    // Fallback to initial tenants
  }

  return NextResponse.json({
    success: true,
    source: 'sandbox_seed',
    count: INITIAL_TENANTS.length,
    tenants: INITIAL_TENANTS,
  });
}
