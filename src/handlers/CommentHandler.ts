// src/handlers/CommentHandler.ts
import { Request, Response } from 'express';
import { CommentService } from '@/services/CommentService';
import { TComment, TPaginatedResponse } from '@/types/schema';

/**
 * Handler for comment-related operations
 */
export class CommentHandler {
  /**
   * Create a new comment
   */
  async create(req: Request, res: Response) {
    const { creatorId, projectId, content } = req.body;
    const comment = await CommentService.create(creatorId, projectId, content);
    res.status(201).json(comment);
  }

  /**
   * Get a comment by ID
   */
  async getById(req: Request, res: Response) {
    const comment = await CommentService.findById(req.params.id);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  }

  /**
   * Update a comment
   */
  async update(req: Request, res: Response) {
    const { content } = req.body;
    const updated = await CommentService.update(req.params.id, content);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  }

  /**
   * Delete a comment
   */
  async delete(req: Request, res: Response) {
    const deleted = await CommentService.delete(req.params.id);
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  }

  /**
   * Get comments for a project
   */
  async getProjectComments(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const comments = await CommentService.getProjectComments(
      req.params.projectId,
      Number(page),
      Number(limit),
    );
    res.json(comments);
  }

  /**
   * Get comments by a creator
   */
  async getCreatorComments(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const comments = await CommentService.getCreatorComments(
      req.params.creatorId,
      Number(page),
      Number(limit),
    );
    res.json(comments);
  }
}
