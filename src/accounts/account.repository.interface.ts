import { Account } from './account.entity';

export abstract class AccountRepository {
  abstract find(): Promise<Account[]>;

  abstract findOne(id: string): Promise<Account>;

  abstract save(payload: Partial<Account>): Promise<Account>;

  abstract delete(id: string): Promise<void>;
}
