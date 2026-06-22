import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSystemPrompt } from '@/lib/system-prompts';

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, agentId, model, projectId, isIncremental } = await req.json();

    // Get agent-specific system prompt
    const systemPrompt = getSystemPrompt(undefined, agentId, isIncremental);

    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || 'I\'d be happy to help with that. Could you provide more details about what you need?';

    // Save message to database if projectId provided
    if (projectId) {
      await prisma.message.create({
        data: {
          projectId,
          role: 'assistant',
          content,
          streaming: false,
        },
      });
    }

    return Response.json({ message: content, agentId });
  } catch (error) {
    console.error('Agent chat API error:', error);
    return Response.json(
      { message: 'I\'m having trouble connecting right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
