import { terminologies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TTerminologyStatus } from '@/types/schema';
import { db } from '@/db';
export class TerminologyService {
    static async findAll() {
        const result = await db.select().from(terminologies);
        return result.map((item) => ({
            ...item,
            status: TTerminologyStatus[item.status],
        }));
    }
    static async findById(id) {
        const result = await db
            .select()
            .from(terminologies)
            .where(eq(terminologies.termId, id))
            .limit(1);
        return result.length > 0
            ? {
                ...result[0],
                status: TTerminologyStatus[result[0].status],
            }
            : null;
    }
    static async findByTerm(term) {
        const result = await db
            .select()
            .from(terminologies)
            .where(eq(terminologies.term, term))
            .limit(1);
        return result.length > 0
            ? {
                ...result[0],
                status: TTerminologyStatus[result[0].status],
            }
            : null;
    }
    static async create(data) {
        const result = await db.insert(terminologies).values(data).returning();
        return {
            ...result[0],
            status: TTerminologyStatus[result[0].status],
        };
    }
    static async update(id, data) {
        const result = await db
            .update(terminologies)
            .set(data)
            .where(eq(terminologies.termId, id))
            .returning();
        return result.length > 0
            ? {
                ...result[0],
                status: TTerminologyStatus[result[0].status],
            }
            : null;
    }
    static async delete(id) {
        const result = await db
            .delete(terminologies)
            .where(eq(terminologies.termId, id));
        return result.rowCount > 0;
    }
    static async findByCategory(categoryId) {
        const result = await db
            .select()
            .from(terminologies)
            .where(eq(terminologies.categoryId, categoryId));
        return result.map((item) => ({
            ...item,
            status: TTerminologyStatus[item.status],
        }));
    }
    static async findByStatus(status) {
        const result = await db
            .select()
            .from(terminologies)
            .where(eq(terminologies.status, status));
        return result.map((item) => ({
            ...item,
            status: TTerminologyStatus[item.status],
        }));
    }
}
//# sourceMappingURL=TerminologyService.js.map