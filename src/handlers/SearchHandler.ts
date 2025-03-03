// src/handlers/ProjectHandler.ts
import { Request, Response } from 'express';
import { ProjectService } from '@/services/ProjectService';
import {
  TCreateProjectRequest,
  TProjectSort,
  TPaginatedResponse,
} from '@/types/schema';

/**
 * Handler for project-related operations
 */
export class ProjectHandler {
  /**
   * Create new project
   */
  async create(req: Request, res: Response) {
    const creatorId = req.params.creatorId;
    const projectData: TCreateProjectRequest = req.body;
    const project = await ProjectService.create(creatorId, projectData);
    res.status(201).json(project);
  }

  /**
   * Get project by ID
   */
  async getById(req: Request, res: Response) {
    const project = await ProjectService.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  }

  /**
   * Update project
   */
  async update(req: Request, res: Response) {
    const updateData: Partial<TCreateProjectRequest> = req.body;
    const updated = await ProjectService.update(req.params.id, updateData);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  }

  /**
   * Delete project
   */
  async delete(req: Request, res: Response) {
    const deleted = await ProjectService.delete(req.params.id);
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  }

  /**
   * Get projects by tags
   */
  async getByTags(req: Request, res: Response) {
    const { tags, page = 1, limit = 10 } = req.query;
    const projects = await ProjectService.getByTags(
      (tags as string).split(','),
      Number(page),
      Number(limit),
    );
    res.json(projects);
  }

  /**
   * Get sorted projects
   */
  async getSorted(req: Request, res: Response) {
    const { sortBy, page = 1, limit = 10 } = req.query;
    const projects = await ProjectService.getSorted(
      sortBy as TProjectSort,
      Number(page),
      Number(limit),
    );
    res.json(projects);
  }

  /**
   * Toggle project like
   */
  async toggleLike(req: Request, res: Response) {
    const { increment = true } = req.body;
    const likes = await ProjectService.toggleLike(req.params.id, increment);
    res.json({ likes });
  }
}
