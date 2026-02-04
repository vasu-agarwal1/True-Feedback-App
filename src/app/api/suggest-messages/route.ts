import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Check if Google AI API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google AI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qoohme, and should be suitable for a diverse audience. 

    Requirements:
    - Avoid personal, sensitive, or controversial topics
    - Focus on universal experiences and interests  
    - Encourage positive sharing of thoughts and experiences
    - Keep questions respectful and inclusive
    - Make them thought-provoking but light-hearted

    Example format: 'What is a hobby you've always wanted to try and why?||If you could travel anywhere in the world, where would you go and what would you do there?||What is a book or movie that has had a significant impact on your life and why?'
    
    Generate 3 new questions following this exact format:`;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'), // Full model path for Google AI
      prompt,
      temperature: 0.8,
    });

    
    return NextResponse.json({ result: text }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error generating message suggestions:', error);
    
    // Handle API errors
    if (error?.status) {
      return NextResponse.json(
        { 
          error: 'Google AI API Error',
          message: error.message || 'Failed to generate suggestions'
        },
        { status: error.status }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}