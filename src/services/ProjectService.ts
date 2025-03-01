import { terminologies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TTerminology, TTerminologyStatus } from '@/types/schema';
import { db } from '@/db';

/**
 * Service class for managing terminology-related database operations
 */
export class TerminologyService {
  /**
   * Retrieves all terminologies from the database
   * @returns Promise containing an array of terminologies or null if none found
   */
  static async findAll(): Promise<TTerminology[] | null> {
    const result = await db.select().from(terminologies);
    return result.map((item) => ({
      ...item,
      status:
        TTerminologyStatus[item.status as keyof typeof TTerminologyStatus],
    }));
  }

  /**
   * Finds a terminology entry by its ID
   * @param id - The unique identifier of the terminology
   * @returns Promise containing the terminology or null if not found
   */
  static async findById(id: number): Promise<TTerminology | null> {
    const result = await db
      .select()
      .from(terminologies)
      .where(eq(terminologies.termId, id))
      .limit(1);
    return result.length > 0
      ? {
          ...result[0],
          status:
            TTerminologyStatus[
              result[0].status as keyof typeof TTerminologyStatus
            ],
        }
      : null;
  }

  /**
   * Finds a terminology entry by its term text
   * @param term - The term to search for
   * @returns Promise containing the terminology or null if not found
   */
  static async findByTerm(term: string): Promise<TTerminology | null> {
    const result = await db
      .select()
      .from(terminologies)
      .where(eq(terminologies.term, term))
      .limit(1);
    return result.length > 0
      ? {
          ...result[0],
          status:
            TTerminologyStatus[
              result[0].status as keyof typeof TTerminologyStatus
            ],
        }
      : null;
  }

  /**
   * Creates a new terminology entry
   * @param data - Terminology data excluding auto-generated fields (termId, createdAt, updatedAt)
   * @returns Promise containing the newly created terminology
   */
  static async create(
    data: Omit<TTerminology, 'termId' | 'createdAt' | 'updatedAt'>,
  ): Promise<TTerminology> {
    const dbData = {
      ...data,
      status: data.status as unknown as 'Draft' | 'Reviewed' | 'Approved',
    };
    const result = await db.insert(terminologies).values(dbData).returning();
    return {
      ...result[0],
      status:
        TTerminologyStatus[result[0].status as keyof typeof TTerminologyStatus],
    };
  }

  /**
   * Updates an existing terminology entry
   * @param id - The ID of the terminology to update
   * @param data - Partial terminology data to update
   * @returns Promise containing the updated terminology or null if not found
   */
  static async update(
    id: number,
    data: Partial<Omit<TTerminology, 'termId' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TTerminology | null> {
    const dbData = {
      ...data,
      status: data.status
        ? (data.status as unknown as 'Draft' | 'Reviewed' | 'Approved')
        : undefined,
    };
    const result = await db
      .update(terminologies)
      .set(dbData)
      .where(eq(terminologies.termId, id))
      .returning();
    return result.length > 0
      ? {
          ...result[0],
          status:
            TTerminologyStatus[
              result[0].status as keyof typeof TTerminologyStatus
            ],
        }
      : null;
  }

  /**
   * Deletes a terminology entry by its ID
   * @param id - The ID of the terminology to delete
   * @returns Promise containing boolean indicating success of deletion
   */
  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(terminologies)
      .where(eq(terminologies.termId, id))
      .returning();
    return result.length > 0;
  }

  /**
   * Finds all terminology entries for a specific category
   * @param categoryId - The ID of the category to find terminologies for
   * @returns Promise containing an array of terminologies
   */
  static async findByCategory(categoryId: number): Promise<TTerminology[]> {
    const result = await db
      .select()
      .from(terminologies)
      .where(eq(terminologies.categoryId, categoryId));
    return result.map((item) => ({
      ...item,
      status:
        TTerminologyStatus[item.status as keyof typeof TTerminologyStatus],
    }));
  }

  /**
   * Finds all terminology entries with a specific status
   * @param status - The status to filter by (Draft, Reviewed, or Approved)
   * @returns Promise containing an array of terminologies
   */
  static async findByStatus(
    status: 'Draft' | 'Reviewed' | 'Approved',
  ): Promise<TTerminology[]> {
    const result = await db
      .select()
      .from(terminologies)
      .where(eq(terminologies.status, status));
    return result.map((item) => ({
      ...item,
      status:
        TTerminologyStatus[item.status as keyof typeof TTerminologyStatus],
    }));
  }
}
