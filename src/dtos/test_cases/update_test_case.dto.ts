import { IsString } from 'class-validator';

export class UpdateTestCaseDto {
  @IsString()
  public id: string;

  @IsString()
  public input: string;

  @IsString()
  public expectedResult: string;
}
