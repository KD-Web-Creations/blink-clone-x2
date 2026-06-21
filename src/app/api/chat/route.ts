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
    const { messages, model, projectId, projectType, isIncremental } = await req.json();

    // Get enhanced system prompt based on project type
    const systemPrompt = getSystemPrompt(projectType, undefined, isIncremental);

    // If projectId provided, load existing project context
    let projectContext = '';
    if (projectId && isIncremental) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });

      if (project && project.files) {
        projectContext = `\n\n**EXISTING PROJECT FILES:**\n${JSON.stringify(project.files, null, 2)}\n\nUser wants to modify this existing project. Only change what they ask for.`;
      }
    }

    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt + projectContext,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || 'I can help you build that! Please tell me more about what you\'d like to create.';

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

    return Response.json({ message: content });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return Response.json(
      { message: `I'm having trouble connecting. Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
