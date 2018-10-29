import { FileDto } from './file.dto';

export interface StoredFile {
  file: FileDto;
  id: string;
  approved: boolean;
}
