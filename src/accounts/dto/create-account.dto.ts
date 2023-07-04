import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Gender } from '../account.entity';

export class CreateAccountDto {
  @ApiProperty({
    example: 'wordsmith',
    description: 'The First Given Name',
  })
  @IsString()
  @Min(5)
  @Max(25)
  firstName: string;

  @ApiProperty({
    example: 'smith',
    description: 'The last given name (family name)',
  })
  @IsString()
  @Min(5)
  @Max(25)
  lastName: string;

  @ApiProperty({
    example: 'email@email.com',
    description: 'The email address of the account e.g xx@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'D',
    description:
      'e.g M = Male, F = Female, D = Diverse, N = would rather not say',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    example: '01234567891',
    description: 'The phone number with country code',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'flat 3 block d, wesbridge , Manchester, UK M12 3AB',
    description: 'The address with postcode',
  })
  @IsString()
  @IsOptional()
  address?: string;
}
