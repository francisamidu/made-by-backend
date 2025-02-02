import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TableSchema, TCategory } from '@/types/schema';
import { db } from '@/db';

export class CategoryService {
  static async findAll(): Promise<
    TCategory[] | TableSchema['categories'] | null
  > {
    const result = await db.select().from(categories);
    return result as TCategory[];
  }

  static async findById(id: number): Promise<TCategory | null> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.categoryId, id))
      .limit(1);
    return (result[0] as TCategory) || null;
  }

  static async findByName(name: string): Promise<TCategory | null> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.categoryName, name))
      .limit(1);
    return (result[0] as TCategory) || null;
  }

  static async create(
    data: Omit<TCategory, 'categoryId' | 'createdAt' | 'updatedAt'>,
  ): Promise<TCategory> {
    const result = await db.insert(categories).values(data).returning();
    return result[0] as TCategory;
  }

  static async update(
    id: number,
    data: Partial<
      Omit<TableSchema['categories'], 'categoryId' | 'createdAt' | 'updatedAt'>
    >,
  ): Promise<TCategory | null> {
    const result = await db
      .update(categories)
      .set(data)
      .where(eq(categories.categoryId, id))
      .returning();
    return (result[0] as TCategory) || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.categoryId, id));
    return result.rowCount > 0;
  }

  static async findChildCategories(parentId: number): Promise<TCategory[]> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.parentCategoryId, parentId));
    return result as TCategory[];
  }
}
