import { MultipartFile } from '@fastify/multipart';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { IMAGE_QUALITY, IMAGE_SIZE } from '../config/images';

import { ImageFolder } from './imageFolders';

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
