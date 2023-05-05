import { IsInt, IsString } from 'class-validator';

export class CreateCodeLanguageDto {
  @IsString()
  public title: string;

  @IsInt()
  public compilerId: number;
}
