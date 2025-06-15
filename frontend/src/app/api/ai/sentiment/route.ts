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
    const { pitchText } = body

    if (!pitchText || typeof pitchText !== 'string') {
      return NextResponse.json(
        { error: 'Pitch text is required' },
        { status: 400 }
      )
    }

    if (pitchText.length < 20) {
      return NextResponse.json(
        { error: 'Pitch text must be at least 20 characters long' },
        { status: 400 }
      )
    }

    const sentimentAnalysis = await aiService.analyzePitchSentiment(pitchText)

    return NextResponse.json({
      success: true,
      data: sentimentAnalysis,
      timestamp: new Date().toISOString(),
      userId
    })

  } catch (error) {
    console.error('Sentiment Analysis API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze sentiment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
