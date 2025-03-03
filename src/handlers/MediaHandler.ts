// src/handlers/MediaHandler.ts
import { Request, Response } from 'express';
import { MediaService } from '@/services/MediaService';
import { AppError } from '@/utils/errors';
import { CloudinaryUploadResponse } from '@/types/media';
import multer from 'multer';

/**
 * Handler for media-related operations
 */
export class MediaHandler {
  /**
   * Upload single image
   * @route POST /api/media/upload
   */
  async uploadImage(req: Request, res: Response<{ url: string }>) {
    const file = req.file;

    if (!file) {
      throw new AppError('No file provided', 400);
    }

    const imageUrl = await MediaService.uploadImage(file);
    res.status(201).json({ url: imageUrl });
  }

  /**
   * Upload multiple images
   * @route POST /api/media/upload/multiple
   */
  async uploadMultipleImages(req: Request, res: Response<{ urls: string[] }>) {
    const files = req.files as Express.Multer.File[];

    if (!files?.length) {
      throw new AppError('No files provided', 400);
    }

    const imageUrls = await MediaService.uploadMultipleImages(files);
    res.status(201).json({ urls: imageUrls });
  }

  /**
   * Delete image
   * @route DELETE /api/media
   */
  async deleteImage(
    req: Request<{}, {}, { url: string }>,
    res: Response<{ success: boolean }>,
  ) {
    const { url } = req.body;

    if (!url) {
      throw new AppError('URL is required', 400);
    }

    await MediaService.deleteImage(url);
    res.json({ success: true });
  }

  /**
   * Generate thumbnail URL
   * @route POST /api/media/thumbnail
   */
  async generateThumbnail(
    req: Request<{}, {}, { url: string; width?: number }>,
    res: Response<{ url: string }>,
  ) {
    const { url, width } = req.body;

    if (!url) {
      throw new AppError('URL is required', 400);
    }

    const thumbnailUrl = MediaService.generateThumbnailUrl(url, width);
    res.json({ url: thumbnailUrl });
  }

  /**
   * Generate optimized image URL
   * @route POST /api/media/optimize
   */
  async generateOptimizedUrl(
    req: Request<
      {},
      {},
      {
        url: string;
        width?: number;
        height?: number;
        quality?: number;
        format?: string;
      }
    >,
    res: Response<{ url: string }>,
  ) {
    const { url, ...options } = req.body;

    if (!url) {
      throw new AppError('URL is required', 400);
    }

    const optimizedUrl = MediaService.generateOptimizedUrl(url, options);
    res.json({ url: optimizedUrl });
  }

  /**
   * Get image metadata
   * @route GET /api/media/metadata
   */
  async getImageMetadata(
    req: Request<{}, {}, {}, { url: string }>,
    res: Response<CloudinaryUploadResponse>,
  ) {
    const { url } = req.query;

    if (!url) {
      throw new AppError('URL is required', 400);
    }

    const metadata = await MediaService.getImageMetadata(url);
    res.json(metadata);
  }
}
