import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TableSchema, TCategory } from '@/types/schema';
import { db } from '@/db';

/**
 * Service class for managing category-related database operations
 */
export class CategoryService {
  /**
   * Retrieves all categories from the database
   * @returns Promise containing an array of categories or null if none found
   */
  static async findAll(): Promise<
    TCategory[] | TableSchema['categories'] | null
  > {
    const result = await db.select().from(categories);
    return result as TCategory[];
  }

  /**
   * Finds a category by its ID
   * @param id - The unique identifier of the category
   * @returns Promise containing the category or null if not found
   */
  static async findById(id: number): Promise<TCategory | null> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.categoryId, id))
      .limit(1);
    return (result[0] as TCategory) || null;
  }

  /**
   * Finds a category by its name
   * @param name - The name of the category to search for
   * @returns Promise containing the category or null if not found
   */
  static async findByName(name: string): Promise<TCategory | null> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.categoryName, name))
      .limit(1);
    return (result[0] as TCategory) || null;
  }

  /**
   * Creates a new category
   * @param data - Category data excluding auto-generated fields (categoryId, createdAt, updatedAt)
   * @returns Promise containing the newly created category
   */
  static async create(
    data: Omit<TCategory, 'categoryId' | 'createdAt' | 'updatedAt'>,
  ): Promise<TCategory> {
    const result = await db.insert(categories).values(data).returning();
    return result[0] as TCategory;
  }

  /**
   * Updates an existing category
   * @param id - The ID of the category to update
   * @param data - Partial category data to update
   * @returns Promise containing the updated category or null if not found
   */
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

  /**
   * Deletes a category by its ID
   * @param id - The ID of the category to delete
   * @returns Promise containing boolean indicating success of deletion
   */
  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.categoryId, id));
    return result?.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Finds all child categories for a given parent category
   * @param parentId - The ID of the parent category
   * @returns Promise containing an array of child categories
   */
  static async findChildCategories(parentId: number): Promise<TCategory[]> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.parentCategoryId, parentId));
    return result as TCategory[];
  }
}
