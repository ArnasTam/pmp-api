import { CourseReviewDto } from '@dtos/course_reviews/course_review.dto';
import { CreateCourseReviewDto } from '@dtos/course_reviews/create_course_review.dto';
import { UpdateCourseReviewDto } from '@dtos/course_reviews/update_course_review.dto';
import { CourseReview } from '@interfaces/course_review';
import AuthService from '@services/auth.service';
import CourseReviewsService from '@services/course_reviews.service';
import { NextFunction, Request, Response } from 'express';

class CourseReviewsController {
  _courseReviewsService = new CourseReviewsService();
  _authService = new AuthService();

  public getCourseReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.query.courseId ? String(req.query.courseId) : null;
      const reviews: CourseReviewDto[] = await this._courseReviewsService.getCourseReviews(courseId);

      res.status(200).json({ data: reviews });
    } catch (error) {
      next(error);
    }
  };

  public createCourseReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reviewDto: CreateCourseReviewDto = req.body;
      const { tokenSubject } = await this._authService.getClaims(req);
      const review: CourseReview = await this._courseReviewsService.createCourseReview(tokenSubject, reviewDto);

      res.status(201).json({ ...review });
    } catch (error) {
      next(error);
    }
  };

  public updateCourseReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reviewDto: UpdateCourseReviewDto = req.body;
      const courseReviewId = req.params.id;
      const { tokenSubject } = await this._authService.getClaims(req);
      const review: CourseReview = await this._courseReviewsService.updateCourseReview(courseReviewId, reviewDto, tokenSubject);

      res.status(201).json({ ...review });
    } catch (error) {
      next(error);
    }
  };

  public deleteCourseReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseReviewId = req.params.id;
      const { tokenSubject } = await this._authService.getClaims(req);
      const review: CourseReview = await this._courseReviewsService.deleteCourseReview(courseReviewId, tokenSubject);

      res.status(200).json({ ...review });
    } catch (error) {
      next(error);
    }
  };
}

export default CourseReviewsController;
