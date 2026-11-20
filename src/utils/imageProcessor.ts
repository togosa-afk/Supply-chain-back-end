import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

export class ImageProcessor {
  /**
   * check tupe of img 
   */
  static async validateImage(buffer: Buffer): Promise<boolean> {
    const detectedType = await fileTypeFromBuffer(buffer);
    if (!detectedType) return false;

    const allowedExtensions = ['jpg', 'png', 'webp', 'jpeg'];
    return allowedExtensions.includes(detectedType.ext);
  }

  static async sanitizeAndCompress(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  }
}