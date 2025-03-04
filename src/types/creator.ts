import { TCreator } from './schema';

export interface CreateCreatorBody
  extends Omit<TCreator, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateCreatorBody
  extends Partial<Omit<TCreator, 'id' | 'createdAt' | 'updatedAt'>> {}
