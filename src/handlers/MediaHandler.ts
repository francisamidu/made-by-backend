import { Response } from 'express';
import { MediaService } from '@/services/MediaService';
import { AppError } from '@/utils/errors';
import { CloudinaryUploadResponse, MediaOptimizeOptions } from '@/types/media';
import { MediaQueryParams } from '@/types/query-params';
import { ApiRequest } from '@/types/request';
import { ApiResponse } from '@/types/response';

/**
 * Handler for media-related operations
 */
export class MediaHandler {
  /**
   * Upload single image
   * @route POST /api/media/upload
   */
  async uploadImage(
    req: ApiRequest<{}, {}, {}> & { file?: Express.Multer.File },
    res: Response<ApiResponse<{ url: string }>>,
  ) {
    const file = req.file;

    if (!file) {
      throw new AppError('No file provided', 400);
    }

    const imageUrl = await MediaService.uploadImage(file);

    res.status(201).json({
      data: { url: imageUrl },
      meta: {
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  }

  /**
   * Upload multiple images
   * @route POST /api/media/upload/multiple
   */
  async uploadMultipleImages(
    req: ApiRequest<{}, {}, {}> & { files?: Express.Multer.File[] },
    res: Response<ApiResponse<{ urls: string[] }>>,
  ) {
    const files = req.files;

    if (!files?.length) {
      throw new AppError('No files provided', 400);
    }

    const imageUrls = await MediaService.uploadMultipleImages(files);

    res.status(201).json({
      data: { urls: imageUrls },
      meta: {
        count: files.length,
        totalSize: files.reduce((sum, file) => sum + file.size, 0),
      },
    });
  }

  /**
   * Delete image
   * @route DELETE /api/media
   */
  async deleteImage(
    req: ApiRequest<{}, { url: string }>,
    res: Response<ApiResponse<{ success: boolean }>>,
  ) {
    const { url } = req.body;

    if (!url) {
      throw new AppError('URL is required', 400);
    }

    await MediaService.deleteImage(url);

    res.json({
      data: { success: true },
      meta: { url },
    });
  }

  /**
   * Generate thumbnail URL
   * @route POST /api/media/thumbnail
   */
  async generateThumbnail(
    req: ApiRequest<{}, { url: string; width?: number }>,
    res: Response<ApiResponse<{ url: string }>>,
  ) {
    const { url, width } = req.body;

    if (!url) {
      throw new AppError('URL is required', 400);
    }

    const thumbnailUrl = MediaService.generateThumbnailUrl(url, width);

    res.json({
      data: { url: thumbnailUrl },
      meta: {
        originalUrl: url,
        width: width || 200,
      },
    });
  }

  /**
   * Generate optimized image URL
   * @route POST /api/media/optimize
   */
  async generateOptimizedUrl(
    req: ApiRequest<{}, MediaOptimizeOptions>,
    res: Response<ApiResponse<{ url: string }>>,
  ) {
    const { url, ...options } = req.body;

    if (!url) {
      throw new AppError('URL is required', 400);
    }

    const optimizedUrl = MediaService.generateOptimizedUrl(url, options);

    res.json({
      data: { url: optimizedUrl },
      meta: {
        originalUrl: url,
        optimizationOptions: options,
      },
    });
  }

  /**
   * Get image metadata
   * @route GET /api/media/metadata
   */
  async getImageMetadata(
    req: ApiRequest<{}, {}, MediaQueryParams>,
    res: Response<ApiResponse<CloudinaryUploadResponse>>,
  ) {
    const { url } = req.query;

    if (!url) {
      throw new AppError('URL is required', 400);
    }

    const metadata = await MediaService.getImageMetadata(url);

    res.json({
      data: metadata,
      meta: { url },
    });
  }
}
