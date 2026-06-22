/**
 * Cloudflare Deployment Service
 * Handles deployment of generated apps to Cloudflare Workers/Pages
 */

interface DeploymentConfig {
  accountId: string;
  apiToken: string;
  workerSecret: string;
  domain: string;
}

interface DeploymentResult {
  success: boolean;
  subdomain?: string;
  deploymentUrl?: string;
  deploymentId?: string;
  error?: string;
}

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export class CloudflareDeployer {
  private config: DeploymentConfig;

  constructor() {
    this.config = {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      workerSecret: process.env.CLOUDFLARE_WORKER_SECRET || '',
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'crealityapp.com',
    };
  }

  /**
   * Deploy a Worker script
   */
  async deployWorker(
    projectId: string,
    files: GeneratedFile[],
    projectName: string
  ): Promise<DeploymentResult> {
    try {
      const subdomain = this.generateSubdomain(projectId);
      const workerName = `app-${projectId}`;

      // Find the main entry point (server.js, index.js, etc.)
      const entryFile = files.find(
        f => f.path.includes('server.js') || 
             f.path.includes('index.js') || 
             f.path.includes('worker.js')
      );

      if (!entryFile) {
        return {
          success: false,
          error: 'No entry point found (server.js, index.js, or worker.js)',
        };
      }

      // Create Worker script with all files bundled
      const workerScript = this.bundleWorkerScript(files, entryFile);

      // Deploy to Cloudflare Workers
      const deployResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/workers/scripts/${workerName}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/javascript',
          },
          body: workerScript,
        }
      );

      if (!deployResponse.ok) {
        const error = await deployResponse.text();
        return { success: false, error: `Worker deployment failed: ${error}` };
      }

      // Set up subdomain routing
      const routeResponse = await this.createRoute(workerName, subdomain);
      if (!routeResponse.success) {
        return routeResponse;
      }

      const deploymentUrl = `https://${subdomain}.${this.config.domain}`;

      return {
        success: true,
        subdomain,
        deploymentUrl,
        deploymentId: workerName,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deployment error',
      };
    }
  }

  /**
   * Deploy a Pages project (for Next.js/React apps)
   */
  async deployPages(
    projectId: string,
    files: GeneratedFile[],
    projectName: string
  ): Promise<DeploymentResult> {
    try {
      const subdomain = this.generateSubdomain(projectId);
      const projectSlug = `app-${projectId}`;

      // Create Pages project
      const createProjectResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/pages/projects`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: projectSlug,
            production_branch: 'main',
            deployment_configs: {
              production: {
                compatibility_date: '2024-01-01',
                compatibility_flags: [],
              },
            },
          }),
        }
      );

      if (!createProjectResponse.ok) {
        const error = await createProjectResponse.text();
        // Project might already exist, continue
        console.log('Project creation response:', error);
      }

      // Upload files and create deployment
      const formData = new FormData();
      
      // Create a manifest of files
      const manifest: Record<string, string> = {};
      files.forEach((file, index) => {
        const fileName = `file_${index}_${file.path.replace(/\//g, '_')}`;
        manifest[file.path] = fileName;
        
        const blob = new Blob([file.content], { type: 'text/plain' });
        formData.append(fileName, blob, file.path);
      });

      formData.append('manifest', JSON.stringify(manifest));

      const deployResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/pages/projects/${projectSlug}/deployments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
          },
          body: formData,
        }
      );

      if (!deployResponse.ok) {
        const error = await deployResponse.text();
        return { success: false, error: `Pages deployment failed: ${error}` };
      }

      const deployData = await deployResponse.json();
      const deploymentUrl = `https://${projectSlug}.pages.dev`;

      // Set up custom domain
      await this.setupCustomDomain(projectSlug, subdomain);

      return {
        success: true,
        subdomain,
        deploymentUrl: `https://${subdomain}.${this.config.domain}`,
        deploymentId: deployData.result?.id || projectSlug,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deployment error',
      };
    }
  }

  /**
   * Create a route for the Worker
   */
  private async createRoute(workerName: string, subdomain: string): Promise<DeploymentResult> {
    try {
      const pattern = `${subdomain}.${this.config.domain}/*`;

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/workers/scripts/${workerName}/routes`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pattern,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Route creation failed: ${error}` };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Route creation error',
      };
    }
  }

  /**
   * Set up custom domain for Pages project
   */
  private async setupCustomDomain(projectSlug: string, subdomain: string): Promise<void> {
    try {
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/pages/projects/${projectSlug}/domains`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${subdomain}.${this.config.domain}`,
          }),
        }
      );
    } catch (error) {
      console.error('Custom domain setup failed:', error);
    }
  }

  /**
   * Bundle Worker script with all files
   */
  private bundleWorkerScript(files: GeneratedFile[], entryFile: GeneratedFile): string {
    // Simple bundling - in production, use esbuild or similar
    const modules = files
      .filter(f => f.path !== entryFile.path)
      .map(f => `// File: ${f.path}\n${f.content}`)
      .join('\n\n');

    return `${modules}\n\n// Entry point\n${entryFile.content}`;
  }

  /**
   * Generate a unique subdomain for the project
   */
  private generateSubdomain(projectId: string): string {
    // Use first 8 characters of project ID for subdomain
    return `app-${projectId.substring(0, 8).toLowerCase()}`;
  }

  /**
   * Delete a deployment
   */
  async deleteDeployment(deploymentId: string, isPages: boolean): Promise<boolean> {
    try {
      const endpoint = isPages
        ? `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/pages/projects/${deploymentId}`
        : `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/workers/scripts/${deploymentId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Deployment deletion failed:', error);
      return false;
    }
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(deploymentId: string, isPages: boolean): Promise<string> {
    try {
      const endpoint = isPages
        ? `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/pages/projects/${deploymentId}`
        : `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/workers/scripts/${deploymentId}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
        },
      });

      if (response.ok) {
        return 'deployed';
      }
      return 'error';
    } catch (error) {
      return 'error';
    }
  }
}

export const deployer = new CloudflareDeployer();
