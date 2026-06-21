import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Save message to project
export async function POST(req: NextRequest) {
  try {
    const { projectId, role, content, streaming } = await req.json();

    if (!projectId || !role || !content) {
      return Response.json(
        { error: 'projectId, role, and content are required' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        projectId,
        role,
        content,
        streaming: streaming || false,
      },
    });

    return Response.json({ message });
  } catch (error) {
    console.error('Save message error:', error);
    return Response.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

// GET - Get messages for a project
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return Response.json({ error: 'projectId required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });

    return Response.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
