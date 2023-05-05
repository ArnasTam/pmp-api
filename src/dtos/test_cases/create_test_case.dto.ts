import { IsString } from 'class-validator';

export class CreateTestCaseDto {
  @IsString()
  public input: string;

  @IsString()
  public expectedResult: string;
}
