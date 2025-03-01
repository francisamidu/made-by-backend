import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TableSchema, TUserRole, type TUser } from '@/types/schema';
import { db } from '@/db';
import { sanitizeUser } from '@/utils/sanitizeCreator';

/**
 * Service class for handling user-related database operations
 */
export class UserService {
  /**
   * Retrieves all users from the database
   * @returns Array of sanitized user objects or null if any user fails sanitization
   */
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

  /**
   * Finds a user by their ID
   * @param id - The unique identifier of the user
   * @returns Sanitized user object or null if not found
   */
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

  /**
   * Finds a user by their username
   * @param username - The username to search for
   * @returns Sanitized user object or null if not found
   */
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

  /**
   * Finds a user by their email address
   * @param email - The email address to search for
   * @returns Sanitized user object or null if not found
   */
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

  /**
   * Creates a new user in the database
   * @param data - User data excluding userId, createdAt, and updatedAt
   * @returns Newly created user object with role enum mapping
   */
  static async create(
    data: Omit<TableSchema['users'], 'userId' | 'createdAt' | 'updatedAt'>,
  ): Promise<TUser> {
    const result = await db.insert(users).values(data).returning();
    return {
      ...result[0],
      role: TUserRole[result[0].role as keyof typeof TUserRole],
    };
  }

  /**
   * Updates an existing user's information
   * @param id - The unique identifier of the user to update
   * @param data - Partial user data to update
   * @returns Updated user object or null if user not found
   */
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

  /**
   * Deletes a user from the database
   * @param id - The unique identifier of the user to delete
   * @returns Boolean indicating whether the deletion was successful
   */
  static async delete(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.userId, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
