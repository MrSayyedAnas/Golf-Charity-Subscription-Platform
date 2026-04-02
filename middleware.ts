import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const proxy = (request: NextRequest) => {
  return NextResponse.next()
}