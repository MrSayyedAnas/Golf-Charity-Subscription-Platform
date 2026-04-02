import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/session'
export function proxy(request: NextRequest) {
  return NextResponse.next()
}