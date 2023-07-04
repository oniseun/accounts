import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { Account, Gender } from '../account.entity';

export class GetAccountDto {
  static TypeOrmEntity(account: Account) {
    return {
      ...account,
    };
  }
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique id associated with the account',
  })
  @IsString()
  readonly id: string;

  @ApiProperty({
    example: 'wordsmith',
    description: 'The First Given Name',
  })
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    example: 'smith',
    description: 'The last given name (family name)',
  })
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    example: 'email@email.com',
    description: 'The email address of the account e.g xx@gmail.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'D',
    description:
      'e.g M = Male, F = Female, D = Diverse, N = would rather not say',
    enum: Gender,
  })
  @IsEnum(Gender)
  readonly gender: Gender;

  @ApiProperty({
    example: '01234567891',
    description: 'The phone number with country code',
  })
  @IsPhoneNumber()
  readonly phone: string;

  @ApiProperty({
    example: 'flat 3 block d, wesbridge , Manchester, UK M12 3AB',
    description: 'The address with postcode',
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    example: '2023-11-05T08:15:30-05:00',
    description: 'The date the account was created',
  })
  @IsString()
  readonly dateCreated: Date;

  @ApiProperty({
    example: '2023-11-05T08:15:30-05:00',
    description: 'The date the account was last updated',
  })
  @IsString()
  readonly dateUpdated: Date;
}
