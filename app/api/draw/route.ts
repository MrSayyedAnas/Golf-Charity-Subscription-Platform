import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateWinners } from '@/lib/draw'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')

    if (error) {
      throw new Error(error.message)
    }

    const result = calculateWinners(scores || [])

    // ✅ ADD LOG HERE
    console.log('🎯 DRAW RESULT:', result)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ DRAW API ERROR:', error)

    return NextResponse.json(
      { error: error.message || 'Draw failed' },
      { status: 500 }
    )
  }
}