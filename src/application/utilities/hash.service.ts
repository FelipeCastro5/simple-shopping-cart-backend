import * as bcrypt from 'bcrypt';

export class HashService {
  private static readonly SALT_ROUNDS = 10;

  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }
}
