import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
export class CategoryService {
    static async findAll() {
        const result = await db.select().from(categories);
        return result;
    }
    static async findById(id) {
        const result = await db
            .select()
            .from(categories)
            .where(eq(categories.categoryId, id))
            .limit(1);
        return result[0] || null;
    }
    static async findByName(name) {
        const result = await db
            .select()
            .from(categories)
            .where(eq(categories.categoryName, name))
            .limit(1);
        return result[0] || null;
    }
    static async create(data) {
        const result = await db.insert(categories).values(data).returning();
        return result[0];
    }
    static async update(id, data) {
        const result = await db
            .update(categories)
            .set(data)
            .where(eq(categories.categoryId, id))
            .returning();
        return result[0] || null;
    }
    static async delete(id) {
        const result = await db
            .delete(categories)
            .where(eq(categories.categoryId, id));
        return result.rowCount > 0;
    }
    static async findChildCategories(parentId) {
        const result = await db
            .select()
            .from(categories)
            .where(eq(categories.parentCategoryId, parentId));
        return result;
    }
}
//# sourceMappingURL=CategoryService.js.map