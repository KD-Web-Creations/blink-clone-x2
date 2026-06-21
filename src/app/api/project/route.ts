import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get project by ID
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return Response.json({ error: 'Project ID required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return Response.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// POST - Create new project
export async function POST(req: NextRequest) {
  try {
    const { name, prompt, type, model } = await req.json();

    if (!name || !prompt) {
      return Response.json(
        { error: 'Name and prompt are required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        prompt,
        type: type || 'fullstack',
        model: model || 'gpt-5.2',
        status: 'draft',
      },
    });

    return Response.json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    return Response.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT - Update project
export async function PUT(req: NextRequest) {
  try {
    const { projectId, ...updateData } = await req.json();

    if (!projectId) {
      return Response.json({ error: 'Project ID required' }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return Response.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    return Response.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE - Delete project
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return Response.json({ error: 'Project ID required' }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return Response.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
