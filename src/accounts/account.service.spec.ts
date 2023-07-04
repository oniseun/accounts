import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Account, Gender } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import AccountRepositoryMock from './account.repository.mock';

describe('AccountService', () => {
  let accountService: AccountService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useClass: AccountRepositoryMock,
        },
      ],
    }).compile();
    accountService = moduleRef.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });

  it('should create an account', async () => {
    const mockAccount: CreateAccountDto = {
      firstName: 'Mark',
      lastName: 'Smith',
      gender: Gender.Male,
      email: 'mark.smith@gmail.com',
      phone: '01117890003',
      address: 'flat 3 block d, wesbridge , Manchester, UK M12 3AB',
    };

    const response = await accountService.createAccount(mockAccount);
    expect(response.firstName).toEqual('Mark');
    expect(response.lastName).toEqual('Smith');
    expect(response).toHaveProperty('dateCreated');
    expect(await accountService.getAccounts()).toHaveLength(1);
  });

  it('should get list of account entries', async () => {
    const mockAccount: CreateAccountDto = {
      firstName: 'Mrs',
      lastName: 'WordSmith',
      gender: Gender.Female,
      email: 'm.wsmith@gmail.com',
      phone: '011178933445',
      address: 'flat 1 block a, portsmouth , London, UK L20 4CB',
    };

    await accountService.createAccount(mockAccount);
    const getAccountResponse = await accountService.getAccounts();
    expect(getAccountResponse).toHaveLength(1);
    expect(getAccountResponse[0].firstName).toEqual('Mrs');
    expect(getAccountResponse[0].lastName).toEqual('WordSmith');
    expect(getAccountResponse[0].email).toEqual('m.wsmith@gmail.com');
    expect(getAccountResponse[0]).toHaveProperty('dateCreated');
  });

  it('should get an account with a specific id', async () => {
    const mockAccount: CreateAccountDto = {
      firstName: 'Mrs',
      lastName: 'WordSmith',
      gender: Gender.Female,
      email: 'm.wsmith@gmail.com',
      phone: '011178933445',
      address: 'flat 1 block a, portsmouth , London, UK L20 4CB',
    };

    const create = await accountService.createAccount(mockAccount);
    const getAccountResponse = await accountService.getAccount(create.id);
    expect(getAccountResponse.firstName).toEqual('Mrs');
    expect(getAccountResponse.lastName).toEqual('WordSmith');
    expect(getAccountResponse.email).toEqual('m.wsmith@gmail.com');
    expect(getAccountResponse).toHaveProperty('dateCreated');
    expect(await accountService.getAccounts()).toHaveLength(1);
  });

  it('should update an account with a specific id', async () => {
    const oldAccountInfo: CreateAccountDto = {
      firstName: 'Mrs',
      lastName: 'WordSmith',
      gender: Gender.Female,
      email: 'm.wsmith@gmail.com',
      phone: '011178933445',
      address: 'flat 1 block a, portsmouth , London, UK L20 4CB',
    };

    const newInfo = {
      firstName: 'newWordSmith',
      lastName: 'Sunak',
      email: 'w.sunak@gmail.com',
      gender: Gender.Male,
    };
    const create = await accountService.createAccount(oldAccountInfo);
    const oldUpdatedTime = create.dateUpdated.getTime();
    const oldEmail = create.email;
    expect(await accountService.getAccounts()).toHaveLength(1);
    const updateAccountResponse = await accountService.updateAccount(
      create.id,
      newInfo,
    );
    expect(updateAccountResponse.firstName).toEqual('newWordSmith');
    expect(updateAccountResponse.lastName).toEqual('Sunak');
    expect(oldEmail).not.toEqual(updateAccountResponse.email);
    expect(updateAccountResponse.email).toEqual('w.sunak@gmail.com');
    expect(oldUpdatedTime).toBeLessThan(
      updateAccountResponse.dateUpdated.getTime(),
    );
    expect(await accountService.getAccounts()).toHaveLength(1);
  });

  it('should delete an account with a specific id', async () => {
    const oldAccountInfo: CreateAccountDto = {
      firstName: 'Mrs',
      lastName: 'WordSmith',
      gender: Gender.Female,
      email: 'm.wsmith@gmail.com',
      phone: '011178933445',
      address: 'flat 1 block a, portsmouth , London, UK L20 4CB',
    };

    const create = await accountService.createAccount(oldAccountInfo);
    expect(await accountService.getAccounts()).toHaveLength(1);
    await accountService.deleteAccount(create.id);
    expect(await accountService.getAccounts()).toHaveLength(0);
  });
});
