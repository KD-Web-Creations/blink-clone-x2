import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, size } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: (size as '1024x1024' | '1792x1024' | '1024x1792') || '1024x1024',
      quality: 'standard',
      n: 1,
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return Response.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

    return Response.json({ image: imageUrl });
  } catch (error) {
    console.error('Image generation API error:', error);
    return Response.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}
