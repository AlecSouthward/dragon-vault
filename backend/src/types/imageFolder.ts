import { IMAGE_FOLDERS } from '../config/imageFolders';

export type ImageFolder = (typeof IMAGE_FOLDERS)[keyof typeof IMAGE_FOLDERS];
