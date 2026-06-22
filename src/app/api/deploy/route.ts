import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { deployer } from '@/lib/cloudflare-deployer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { projectId, files, projectType } = await req.json();

    if (!projectId || !files || !Array.isArray(files)) {
      return Response.json(
        { error: 'Missing required fields: projectId, files' },
        { status: 400 }
      );
    }

    // Get project from database
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'building' },
    });

    // Determine deployment type based on files
    const isFullStack = files.some((f: any) => 
      f.path.includes('package.json') || 
      f.path.includes('next.config') ||
      f.path.includes('react')
    );

    // Deploy to Cloudflare
    const deployment = isFullStack
      ? await deployer.deployPages(projectId, files, project.name)
      : await deployer.deployWorker(projectId, files, project.name);

    if (!deployment.success) {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'error' },
      });

      return Response.json(
        { error: deployment.error || 'Deployment failed' },
        { status: 500 }
      );
    }

    // Update project with deployment info
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'deployed',
        subdomain: deployment.subdomain,
        deploymentUrl: deployment.deploymentUrl,
        deploymentId: deployment.deploymentId,
        files: files,
      },
    });

    return Response.json({
      success: true,
      deployment: {
        url: deployment.deploymentUrl,
        subdomain: deployment.subdomain,
        id: deployment.deploymentId,
      },
    });
  } catch (error) {
    console.error('Deployment API error:', error);
    return Response.json(
      { error: 'Internal server error during deployment' },
      { status: 500 }
    );
  }
}
