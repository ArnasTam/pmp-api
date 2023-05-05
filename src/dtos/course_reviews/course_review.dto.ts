import { UserDto } from '@dtos/users/user.dto';

export class CourseReviewDto {
  public id: string;
  public content: string;
  public author: UserDto;
}
