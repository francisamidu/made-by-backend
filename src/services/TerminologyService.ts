import { terminologies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TTerminology, TTerminologyStatus } from '@/types/schema';
import { db } from '@/db';

export class TerminologyService {
  async findAll(): Promise<TTerminology[] | null> {
    const result = await db.select().from(terminologies);
    return result.map((item) => ({
      ...item,
      status:
        TTerminologyStatus[item.status as keyof typeof TTerminologyStatus],
    }));
  }

  async findById(id: number): Promise<TTerminology | null> {
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

  async findByTerm(term: string): Promise<TTerminology | null> {
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

  async create(
    data: Omit<TTerminology, 'termId' | 'createdAt' | 'updatedAt'>,
  ): Promise<TTerminology> {
    const result = await db.insert(terminologies).values(data).returning();
    return {
      ...result[0],
      status:
        TTerminologyStatus[result[0].status as keyof typeof TTerminologyStatus],
    };
  }

  async update(
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

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(terminologies)
      .where(eq(terminologies.termId, id));
    return result.rowCount > 0;
  }

  async findByCategory(categoryId: number): Promise<TTerminology[]> {
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

  async findByStatus(
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
