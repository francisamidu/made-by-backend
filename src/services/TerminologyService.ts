import { terminologies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TTerminology, TTerminologyStatus } from '@/types/schema';
import { db } from '@/db';

export class TerminologyService {
  static async findAll(): Promise<TTerminology[] | null> {
    const result = await db.select().from(terminologies);
    return result.map((item) => ({
      ...item,
      status:
        TTerminologyStatus[item.status as keyof typeof TTerminologyStatus],
    }));
  }

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

  static async create(
    data: Omit<TTerminology, 'termId' | 'createdAt' | 'updatedAt'>,
  ): Promise<TTerminology> {
    const result = await db.insert(terminologies).values(data).returning();
    return {
      ...result[0],
      status:
        TTerminologyStatus[result[0].status as keyof typeof TTerminologyStatus],
    };
  }

  static async update(
    id: number,
    data: Partial<Omit<TTerminology, 'termId' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TTerminology | null> {
    const result = await db
      .update(terminologies)
      .set(data)
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

  static async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(terminologies)
      .where(eq(terminologies.termId, id));
    return result.rowCount > 0;
  }

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
