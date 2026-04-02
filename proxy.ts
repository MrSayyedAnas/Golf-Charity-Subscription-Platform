import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export default function proxy(request: NextRequest) {
  return NextResponse.next()
}