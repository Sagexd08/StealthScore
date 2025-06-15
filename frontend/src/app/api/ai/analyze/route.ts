import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import aiService from '../../../../lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { pitchText, industry = 'technology', fundingStage = 'seed' } = body

    if (!pitchText || typeof pitchText !== 'string') {
      return NextResponse.json(
        { error: 'Pitch text is required' },
        { status: 400 }
      )
    }

    if (pitchText.length < 50) {
      return NextResponse.json(
        { error: 'Pitch text must be at least 50 characters long' },
        { status: 400 }
      )
    }

    if (pitchText.length > 10000) {
      return NextResponse.json(
        { error: 'Pitch text must be less than 10,000 characters' },
        { status: 400 }
      )
    }

    const analysis = await aiService.performComprehensiveAnalysis(
      pitchText,
      industry,
      fundingStage
    )

    return NextResponse.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
      userId
    })

  } catch (error) {
    console.error('AI Analysis API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze pitch',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'AI Analysis API',
      version: '1.0.0',
      endpoints: {
        analyze: 'POST /api/ai/analyze',
        sentiment: 'POST /api/ai/sentiment',
        market: 'POST /api/ai/market',
        competitive: 'POST /api/ai/competitive'
      }
    },
    { status: 200 }
  )
}
