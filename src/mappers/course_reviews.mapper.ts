import { CourseReviewDto } from '@dtos/course_reviews/course_review.dto';
import { UserDto } from '@dtos/users/user.dto';
import { CourseReview } from '@interfaces/course_review';

export class CourseReviewsMapper {
  public static mapCourseReviewToCourseReviewDto(review: CourseReview, user: UserDto): CourseReviewDto {
    return {
      ...review,
      author: user,
    };
  }

  public static mapCourseReviewListToCourseReviewDtoList(reviews: CourseReview[], users: Map<string, UserDto>): CourseReviewDto[] {
    return reviews.map(review => {
      return this.mapCourseReviewToCourseReviewDto(review, users.get(review.authorId));
    });
  }
}
