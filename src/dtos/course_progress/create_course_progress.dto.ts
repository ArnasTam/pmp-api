import { IsString, IsUUID } from 'class-validator';

export class CreateCourseProgressDto {
  @IsUUID()
  public courseId: string;

  @IsString()
  public userId: string;
}
