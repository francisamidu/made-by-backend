import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TUserRole } from '@/types/schema';
import { db } from '@/db';
export class UserService {
    static async findAll() {
        const result = await db.select().from(users);
        return result.map((user) => ({
            ...user,
            role: TUserRole[user.role],
        }));
    }
    static async findById(id) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.userId, id))
            .limit(1);
        if (result[0]) {
            return {
                ...result[0],
                role: TUserRole[result[0].role],
            };
        }
        return null;
    }
    static async findByUsername(username) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);
        if (result[0]) {
            return {
                ...result[0],
                role: TUserRole[result[0].role],
            };
        }
        return null;
    }
    static async findByEmail(email) {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        if (result[0]) {
            return {
                ...result[0],
                role: TUserRole[result[0].role],
            };
        }
        return null;
    }
    static async create(data) {
        const result = await db.insert(users).values(data).returning();
        return {
            ...result[0],
            role: TUserRole[result[0].role],
        };
    }
    static async update(id, data) {
        const result = await db
            .update(users)
            .set(data)
            .where(eq(users.userId, id))
            .returning();
        if (result[0]) {
            return {
                ...result[0],
                role: TUserRole[result[0].role],
            };
        }
        return null;
    }
    static async delete(id) {
        const result = await db.delete(users).where(eq(users.userId, id));
        return result.rowCount > 0;
    }
}
//# sourceMappingURL=UserService.js.map