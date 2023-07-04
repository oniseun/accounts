import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async getAccounts(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async getAccount(id: string): Promise<Account> {
    return await this.accountRepository.findOne({
      where: { id },
    });
  }

  async createAccount(account: Partial<Account>) {
    return await this.accountRepository.save(account);
  }

  async updateAccount(id: string, account: Partial<Account>) {
    const newAccount = Object.keys(account).reduce(
      (newProp, prop) => {
        if (account[prop] !== null && account[prop].length > 0) {
          newProp[prop] = account[prop];
        }
        return newProp;
      },
      { id },
    );
    return await this.accountRepository.save(newAccount);
  }

  async deleteAccount(id: string) {
    this.accountRepository.delete({ id });
  }
}
