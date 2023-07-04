import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { GetAccountDto } from './dto/get-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
@ApiTags('Accounts')
@ApiResponse({ status: 200, description: 'Forbidden.' })
@ApiResponse({ status: 404, description: 'Not found' })
export class AccountController {
  constructor(private service: AccountService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all accounts',
    description: 'gets all currently created accounts',
  })
  @ApiResponse({
    status: 200,
    description: 'gets all entries in accounts ',
    type: GetAccountDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Empty Result',
  })
  async getAll(): Promise<GetAccountDto[]> {
    const list = await this.service.getAccounts();
    return list.map((account) => GetAccountDto.TypeOrmEntity(account));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get account by id',
    description: 'Specify an id for an existing account and it returns rseult',
  })
  @ApiResponse({
    status: 200,
    description: 'Gets a single account by id ',
    type: GetAccountDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async get(@Param('id') id: string): Promise<GetAccountDto> {
    const response = await this.service.getAccount(id);
    return GetAccountDto.TypeOrmEntity(response);
  }

  @Post()
  @ApiOperation({
    summary: 'Creates an account',
    description: 'creates account entry based on payload',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the new account created ',
    type: GetAccountDto,
  })
  @ApiResponse({
    status: 400,
    description: 'bad Request Email or phone number already exist',
  })
  async create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<GetAccountDto> {
    const create = await this.service.createAccount(createAccountDto);
    if (!create) {
      throw new BadRequestException(
        `Email or phone number likely already exist`,
      );
    }
    return GetAccountDto.TypeOrmEntity(create);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns the new account updated ',
    type: GetAccountDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Id does not exist',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, Email or phone number already exist',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: Partial<CreateAccountDto>,
  ): Promise<GetAccountDto> {
    const account = await this.get(id);
    if (account) {
      const update = await this.service.updateAccount(id, updateAccountDto);

      if (!update) {
        throw new ForbiddenException(
          `Email or phone number likely already exist`,
        );
      }
      return GetAccountDto.TypeOrmEntity(update);
    }

    throw new NotFoundException(`User with id : ${id} not found`);
  }

  @ApiResponse({
    status: 200,
    description: 'Returns the newly deleted account ',
    type: GetAccountDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Id does not exist',
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<GetAccountDto> {
    const account = await this.get(id);
    if (account) {
      await this.service.deleteAccount(id);
      return account;
    }

    throw new NotFoundException(`User with id : ${id} not found`);
  }
}
