import { IMAGE_FOLDERS } from '../utils/imageFolders';

export type ImageFolder = (typeof IMAGE_FOLDERS)[keyof typeof IMAGE_FOLDERS];
