import { Account } from './account.entity';
import { v4 as uuidv4 } from 'uuid';
import { AccountRepository } from './account.repository.interface';

export default class AccountRepositoryMock extends AccountRepository {
  constructor(private accountStore: Account[] = []) {
    super();
  }
  async find(): Promise<Account[]> {
    return this.accountStore;
  }

  async findOne(id: string): Promise<Account> {
    return this.accountStore.find((account) => (account.id = id));
  }

  async save(payload: Partial<Account>): Promise<Account> {
    if (payload.id !== undefined) {
      const accountIndex = this.accountStore.findIndex(
        (account) => (account.id = payload.id),
      );
      Object.keys(payload).forEach((key) => {
        this.accountStore[accountIndex][key] = payload[key];
      });

      const ud = new Date();
      ud.setSeconds(ud.getSeconds() + 60);
      this.accountStore[accountIndex].dateUpdated = ud;
      console.log({ ud: ud.getTime() });

      return this.accountStore[accountIndex];
    }

    payload.id = uuidv4();
    payload.dateCreated = new Date();
    payload.dateUpdated = new Date();

    this.accountStore.push(payload as Account);
    return payload as Account;
  }

  async delete(id: string): Promise<void> {
    const accountIndex = this.accountStore.findIndex(
      (account) => (account.id = id),
    );
    this.accountStore.splice(accountIndex, 1);
  }
}
