import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account, Gender } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import AccountRepositoryMock from './account.repository.mock';

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useClass: AccountRepositoryMock,
        },
      ],
    }).compile();

    accountController = app.get<AccountController>(AccountController);
    accountService = app.get<AccountService>(AccountService);
    jest.spyOn(accountService, 'createAccount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });

  describe('POST /accounts', () => {
    it('should create an account', async () => {
      const mockAccountPayload: CreateAccountDto = {
        firstName: 'Mark',
        lastName: 'Smith',
        gender: Gender.Male,
        email: 'mark.smith@gmail.com',
        phone: '01117890003',
        address: 'flat 3 block d, wesbridge , Manchester, UK M12 3AB',
      };

      const response = await accountController.create(mockAccountPayload);
      expect(accountService.createAccount).toHaveBeenCalledWith(
        mockAccountPayload,
      );
      expect(response.firstName).toEqual('Mark');
      expect(response.lastName).toEqual('Smith');
      expect(response).toHaveProperty('dateCreated');
      expect(await accountController.getAll()).toHaveLength(1);
    });
  });

  describe('GET /accounts', () => {
    it('should get all account entries', async () => {
      jest.spyOn(accountService, 'getAccounts');
      const mockAccountPayload: CreateAccountDto = {
        firstName: 'Mrs',
        lastName: 'WordSmith',
        gender: Gender.Female,
        email: 'm.wsmith@gmail.com',
        phone: '011178933445',
        address: 'flat 1 block a, portsmouth , London, UK L20 4CB',
      };

      await accountController.create(mockAccountPayload);
      const getAccountResponse = await accountController.getAll();
      expect(accountService.createAccount).toHaveBeenCalledWith(
        mockAccountPayload,
      );
      expect(getAccountResponse).toHaveLength(1);
      expect(accountService.getAccounts).toHaveBeenCalledWith();
      expect(getAccountResponse[0].firstName).toEqual('Mrs');
      expect(getAccountResponse[0].lastName).toEqual('WordSmith');
      expect(getAccountResponse[0].email).toEqual('m.wsmith@gmail.com');
      expect(getAccountResponse[0]).toHaveProperty('dateCreated');
    });
  });

  describe('GET /accounts/:id', () => {
    it('should get an account with a specific id', async () => {
      jest.spyOn(accountService, 'getAccount');
      const mockAccountPayload: CreateAccountDto = {
        firstName: 'Mrs',
        lastName: 'WordSmith',
        gender: Gender.Female,
        email: 'm.wsmith@gmail.com',
        phone: '011178933445',
        address: 'flat 1 block a, portsmouth , London, UK L20 4CB',
      };

      const create = await accountController.create(mockAccountPayload);

      const getAccountResponse = await accountController.get(create.id);
      expect(accountService.createAccount).toHaveBeenCalledWith(
        mockAccountPayload,
      );
      expect(accountService.getAccount).toHaveBeenCalledWith(create.id);
      expect(getAccountResponse.firstName).toEqual('Mrs');
      expect(getAccountResponse.lastName).toEqual('WordSmith');
      expect(getAccountResponse.email).toEqual('m.wsmith@gmail.com');
      expect(getAccountResponse).toHaveProperty('dateCreated');
      expect(await accountController.getAll()).toHaveLength(1);
    });
  });

  describe('PUT /accounts/:id', () => {
    it('should update an account with a specific id', async () => {
      jest.spyOn(accountService, 'getAccounts');
      jest.spyOn(accountService, 'updateAccount');
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
      const create = await accountController.create(oldAccountInfo);
      expect(accountService.createAccount).toHaveBeenCalledWith(oldAccountInfo);
      const oldUpdatedTime = create.dateUpdated.getTime();
      const oldEmail = create.email;
      expect(await accountController.getAll()).toHaveLength(1);
      expect(accountService.getAccounts).toHaveBeenCalled();
      const updateAccountResponse = await accountController.update(
        create.id,
        newInfo,
      );
      expect(accountService.updateAccount).toHaveBeenCalledWith(
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
      expect(await accountController.getAll()).toHaveLength(1);
    });
  });

  describe('DELETE /accounts/:id', () => {
    it('should delete an account with a specific id', async () => {
      jest.spyOn(accountService, 'deleteAccount');
      jest.spyOn(accountService, 'getAccount');
      const accountToDeleteInfo: CreateAccountDto = {
        firstName: 'Mrs',
        lastName: 'WordSmith',
        gender: Gender.Female,
        email: 'm.wsmith@gmail.com',
        phone: '011178933445',
        address: 'flat 1 block a, portsmouth , London, UK L20 4CB',
      };

      const create = await accountController.create(accountToDeleteInfo);
      expect(accountService.createAccount).toHaveBeenCalledWith(
        accountToDeleteInfo,
      );
      expect(await accountController.getAll()).toHaveLength(1);
      await accountController.delete(create.id);
      expect(accountService.getAccount).toHaveBeenCalledWith(create.id);
      expect(accountService.deleteAccount).toHaveBeenCalledWith(create.id);
      expect(await accountController.getAll()).toHaveLength(0);
    });
  });
});
