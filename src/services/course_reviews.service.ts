import { CourseReviewsMapper } from '@/mappers/course_reviews.mapper';
import { CourseReviewDto } from '@dtos/course_reviews/course_review.dto';
import { CreateCourseReviewDto } from '@dtos/course_reviews/create_course_review.dto';
import { UpdateCourseReviewDto } from '@dtos/course_reviews/update_course_review.dto';
import { CourseReviewEntity } from '@entities/course_reviews.entity';
import { HttpException } from '@exceptions/HttpException';
import { CourseReview } from '@interfaces/course_review';
import AuthService from '@services/auth.service';
import CoursesService from '@services/courses.service';
import { isEmpty } from '@utils/util';

class CourseReviewsService {
  private _authService = new AuthService();
  private _courseService = new CoursesService();

  public async getCourseReviews(courseId: string): Promise<CourseReviewDto[]> {
    const reviews = await CourseReviewEntity.find({ where: { course: { id: courseId } }, relations: ['course'], order: { createdAt: 'DESC' } });

    const users = await this._authService.getUsersByIds(reviews.map(course => course.authorId));

    return CourseReviewsMapper.mapCourseReviewListToCourseReviewDtoList(reviews, users);
  }

  public async createCourseReview(authorId: string, data: CreateCourseReviewDto): Promise<CourseReview> {
    if (isEmpty(authorId)) throw new HttpException(400, 'authorId must not be empty');

    const course = CourseReviewEntity.create({
      content: data.content,
      course: await this._courseService.getCourseById(data.courseId),
      authorId: authorId,
    });

    return await course.save();
  }

  public async updateCourseReview(id: string, updateCourseReviewDto: UpdateCourseReviewDto, callerId: string): Promise<CourseReview> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const review = await CourseReviewEntity.findOne({ where: { id } });
    if (!review) throw new HttpException(409, 'Course review with the specified id does not exist');
    if (callerId !== review.authorId) throw new HttpException(403, 'No Permission');

    review.content = updateCourseReviewDto.content ?? review.content;

    return await review.save();
  }

  public async deleteCourseReview(id: string, callerId: string): Promise<CourseReview> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const review = await CourseReviewEntity.findOne({ where: { id: id } });
    if (!review) throw new HttpException(409, 'Course review with the specified id does not exist');
    if (callerId !== review.authorId) throw new HttpException(403, 'No Permission');

    await CourseReviewEntity.delete({ id: id });
    return review;
  }
}

export default CourseReviewsService;
