import sharp from 'sharp';

/**
 * Configuration interface for media service
 */
export interface MediaConfig {
  allowedMimeTypes: string[];
  maxFileSize: number; // in bytes
  imageProcessing: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
    format: keyof sharp.FormatEnum;
  };
  cloudinary: {
    folder: string;
    resourceType: string;
    allowedFormats: string[];
  };
}

/**
 * Interface for Cloudinary upload response
 */
export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export interface MediaOptimizeOptions {
  url: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'png' | 'webp';
}
