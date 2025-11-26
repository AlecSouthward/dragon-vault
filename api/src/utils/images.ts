import { MultipartFile } from '@fastify/multipart';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { ImageFolder } from '../types/imageFolder';

import { IMAGE_QUALITY, IMAGE_SIZE } from '../config/images';

export const compressImage = async (image: MultipartFile) => {
  const buffer = await image.toBuffer();

  return await sharp(buffer)
    .resize({
      width: IMAGE_SIZE.width,
      height: IMAGE_SIZE.height,
      withoutEnlargement: true,
    })
    .webp({ quality: IMAGE_QUALITY })
    .toBuffer();
};

export const saveImage = async (
  imageBuffer: Buffer,
  fileName: string,
  folder: ImageFolder
) => {
  // TODO: Save in a better place
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const uploadDir = path.join(__dirname, 'uploads/' + folder);

  await fs.promises.mkdir(uploadDir, { recursive: true });

  const destPath = path.join(uploadDir, fileName);
  await fs.promises.writeFile(destPath, imageBuffer);
};
