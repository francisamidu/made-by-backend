// src/services/MediaService.ts
import { CloudinaryUploadResponse, MediaConfig } from '@/types/media';
import { AppError } from '@/utils/errors';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service class for handling media-related operations
 */
export class MediaService {
  private static config: MediaConfig = {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    imageProcessing: {
      maxWidth: 2000,
      maxHeight: 2000,
      quality: 80,
      format: 'webp',
    },
    cloudinary: {
      folder: 'madeby',
      resourceType: 'image',
      allowedFormats: ['jpg', 'png', 'webp'],
    },
  };

  /**
   * Initialize Cloudinary
   */
  private static initializeCloudinary() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Validate file
   */
  private static validateFile(file: Express.Multer.File): void {
    if (
      !file.mimetype ||
      !this.config.allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new Error('Invalid file type');
    }

    if (file.size > this.config.maxFileSize) {
      throw new Error('File size exceeds limit');
    }
  }

  /**
   * Process image before upload
   */
  private static async processImage(
    file: Express.Multer.File,
  ): Promise<Buffer> {
    const { maxWidth, maxHeight, quality, format } =
      this.config.imageProcessing;

    return sharp(file.buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(format, { quality })
      .toBuffer();
  }

  /**
   * Upload to Cloudinary
   */
  private static async uploadToCloudinary(
    buffer: Buffer,
    options: { public_id?: string } = {},
  ): Promise<CloudinaryUploadResponse> {
    this.initializeCloudinary();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.config.cloudinary.folder,
          resource_type: 'image',
          allowed_formats: this.config.cloudinary.allowedFormats,
          ...options,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResponse);
        },
      );

      uploadStream.end(buffer);
    });
  }

  /**
   * Upload single image
   */
  static async uploadImage(file: Express.Multer.File): Promise<string> {
    // Validate file
    this.validateFile(file);

    // Process image
    const processedBuffer = await this.processImage(file);

    // Generate unique ID
    const public_id = uuidv4();

    // Upload to Cloudinary
    const result = await this.uploadToCloudinary(processedBuffer, {
      public_id,
    });
    if (result.secure_url === undefined) {
      throw new Error(`Failed to upload image: ${result}`);
    }
    return result.secure_url;
  }

  /**
   * Upload multiple images
   */
  static async uploadMultipleImages(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return await Promise.all(uploadPromises);
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(url: string): Promise<void> {
    this.initializeCloudinary();

    // Extract public_id from URL
    const publicId = url.split('/').pop()!.split('.')[0];

    await cloudinary.uploader.destroy(
      `${this.config.cloudinary.folder}/${publicId}`,
    );
  }
  /**
   * Generate image thumbnail URL
   */
  static generateThumbnailUrl(url: string, width: number = 200): string {
    return cloudinary.url(url, {
      width,
      crop: 'scale',
      format: 'webp',
      quality: 80,
    });
  }

  /**
   * Generate optimized image URL
   */
  static generateOptimizedUrl(
    url: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
    } = {},
  ): string {
    return cloudinary.url(url, {
      width: options.width || this.config.imageProcessing.maxWidth,
      height: options.height || this.config.imageProcessing.maxHeight,
      crop: 'limit',
      format: options.format || this.config.imageProcessing.format,
      quality: options.quality || this.config.imageProcessing.quality,
    });
  }

  /**
   * Get image metadata from Cloudinary
   */
  /**
   * Get image metadata from Cloudinary
   */
  static async getImageMetadata(
    url: string,
  ): Promise<CloudinaryUploadResponse> {
    this.initializeCloudinary();

    if (!url) {
      throw new AppError('URL is required', 400);
    }

    const publicId = url.split('/').pop()?.split('.')[0];

    if (!publicId) {
      throw new AppError('Invalid URL format', 400);
    }

    const fullPublicId = `${this.config.cloudinary.folder}/${publicId}`;
    const result = await cloudinary.api.resource(fullPublicId);

    return result as CloudinaryUploadResponse;
  }
}
