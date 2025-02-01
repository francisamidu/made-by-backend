import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TableSchema, TUserRole, type TUser } from '@/types/schema';
import { db } from '@/db';

export class UserService {
  static async findAll(): Promise<TUser[] | null> {
    const result = await db.select().from(users);
    return result.map((user) => ({
      ...user,
      role: TUserRole[user.role as keyof typeof TUserRole],
    }));
  }

  static async findById(id: number): Promise<TUser | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.userId, id))
      .limit(1);
    if (result[0]) {
      return {
        ...result[0],
        role: TUserRole[result[0].role as keyof typeof TUserRole],
      };
    }
    return null;
  }

  static async findByUsername(username: string): Promise<TUser | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (result[0]) {
      return {
        ...result[0],
        role: TUserRole[result[0].role as keyof typeof TUserRole],
      };
    }
    return null;
  }

  static async findByEmail(email: string): Promise<TUser | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (result[0]) {
      return {
        ...result[0],
        role: TUserRole[result[0].role as keyof typeof TUserRole],
      };
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
    return result.rowCount > 0;
  }
}
