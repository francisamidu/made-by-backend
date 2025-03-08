import { Response } from 'express';
import { CommentService } from '@/services/CommentService';
import { TComment, TPaginatedResponse } from '@/types/schema';
import { AppError } from '@/utils/errors';
import { CreateCommentBody, UpdateCommentBody } from '@/types/comment';
import { CommentPathParams, CommentQueryParams } from '@/types/query-params';
import { ApiRequest } from '@/types/request';
import { ApiResponse } from '@/types/response';

/**
 * Handler for comment-related operations
 */
export class CommentHandler {
  /**
   * Create a new comment
   * @route POST /api/comments
   */
  static async create(
    req: ApiRequest<{}, CreateCommentBody>,
    res: Response<ApiResponse<TComment>>,
  ) {
    const { creatorId, projectId, content } = req.body;

    if (!content?.trim()) {
      throw new AppError('Comment content is required', 400);
    }

    const comment = await CommentService.create(creatorId, projectId, content);

    res.status(201).json({
      data: comment,
      meta: {
        createdAt: comment.createdAt,
        projectId,
        creatorId,
      },
    });
  }

  /**
   * Get a comment by ID
   * @route GET /api/comments/:id
   */
  static async getById(
    req: ApiRequest<CommentPathParams>,
    res: Response<ApiResponse<TComment>>,
  ) {
    const comment = await CommentService.findById(String(req.params.id));

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    res.json({
      data: comment,
      meta: {
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    });
  }

  /**
   * Update a comment
   * @route PUT /api/comments/:id
   */
  static async update(
    req: ApiRequest<CommentPathParams, UpdateCommentBody>,
    res: Response<ApiResponse<TComment>>,
  ) {
    const { id } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      throw new AppError('Comment content is required', 400);
    }

    const updated = await CommentService.update(String(id), content);

    if (!updated) {
      throw new AppError('Comment not found', 404);
    }

    res.json({
      data: updated,
      meta: {
        updatedAt: updated.updatedAt,
        originalId: id,
      },
    });
  }

  /**
   * Delete a comment
   * @route DELETE /api/comments/:id
   */
  static async delete(
    req: ApiRequest<CommentPathParams>,
    res: Response<ApiResponse<{ success: boolean }>>,
  ) {
    const { id } = req.params;
    const deleted = await CommentService.delete(String(id));

    if (!deleted) {
      throw new AppError('Comment not found', 404);
    }

    res.json({
      data: { success: true },
      meta: {
        deletedAt: new Date().toISOString(),
        commentId: id,
      },
    });
  }

  /**
   * Get comments for a project
   * @route GET /api/comments/project/:projectId
   */
  static async getProjectComments(
    req: ApiRequest<CommentPathParams, {}, CommentQueryParams>,
    res: Response<ApiResponse<TPaginatedResponse<TComment>>>,
  ) {
    const { projectId } = req.params;
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '10'));

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const comments = await CommentService.getProjectComments(
      projectId as string,
      page,
      limit,
    );

    res.json({
      data: comments,
      meta: {
        projectId,
        page,
        limit,
        total: comments.total,
        hasMore: comments.hasMore,
      },
    });
  }

  /**
   * Get comments by a creator
   * @route GET /api/comments/creator/:creatorId
   */
  static async getCreatorComments(
    req: ApiRequest<CommentPathParams, {}, CommentQueryParams>,
    res: Response<ApiResponse<TPaginatedResponse<TComment>>>,
  ) {
    const { creatorId } = req.params;
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '10'));

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const comments = await CommentService.getCreatorComments(
      creatorId as string,
      page,
      limit,
    );

    res.json({
      data: comments,
      meta: {
        creatorId,
        page,
        limit,
        total: comments.total,
        hasMore: comments.hasMore,
      },
    });
  }
}
