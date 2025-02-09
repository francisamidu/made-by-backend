import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TableSchema, TUserRole, type TUser } from '@/types/schema';
import { db } from '@/db';
import { sanitizeUser } from '@/utils/sanitizeUser';

export class UserService {
  static async findAll(): Promise<Partial<TUser>[] | null> {
    const result = await db.select().from(users);
    const results = result.map((user) =>
      sanitizeUser({
        ...user,
        role: TUserRole[user.role as keyof typeof TUserRole],
      }),
    );
    return results.every((result) => result !== null) ? results : null;
  }

  static async findById(id: number): Promise<TUser | Partial<TUser> | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.userId, id))
      .limit(1);
    if (result[0]) {
      return sanitizeUser({
        ...result[0],
        role: TUserRole[result[0].role as keyof typeof TUserRole],
      });
    }
    return null;
  }

  static async findByUsername(
    username: string,
  ): Promise<TUser | Partial<TUser> | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (result[0]) {
      return sanitizeUser({
        ...result[0],
        role: TUserRole[result[0].role as keyof typeof TUserRole],
      });
    }
    return null;
  }

  static async findByEmail(
    email: string,
  ): Promise<TUser | Partial<TUser> | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (result[0]) {
      return sanitizeUser({
        ...result[0],
        role: TUserRole[result[0].role as keyof typeof TUserRole],
      });
    }
    return null;
  }

  static async create(
    data: Omit<TableSchema['users'], 'userId' | 'createdAt' | 'updatedAt'>,
  ): Promise<TUser> {
    const result = await db.insert(users).values(data).returning();
    return {
      ...result[0],
      role: TUserRole[result[0].role as keyof typeof TUserRole],
    };
  }

  static async update(
    id: number,
    data: Partial<
      Omit<TableSchema['users'], 'userId' | 'createdAt' | 'updatedAt'>
    >,
  ): Promise<TUser | null> {
    const result = await db
      .update(users)
      .set(data)
      .where(eq(users.userId, id))
      .returning();
    if (result[0]) {
      return {
        ...result[0],
        role: TUserRole[result[0].role as keyof typeof TUserRole],
      };
    }
    return null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.userId, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
