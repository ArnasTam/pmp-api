import CourseReviewsController from '@controllers/course_reviews.controller';
import { CreateCourseReviewDto } from '@dtos/course_reviews/create_course_review.dto';
import { UpdateCourseReviewDto } from '@dtos/course_reviews/update_course_review.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class CourseReviewsRoutes implements Routes {
  public router = Router();
  public basePath = '/course-reviews';
  private _courseReviewsController = new CourseReviewsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.basePath}`, authMiddleware, this._courseReviewsController.getCourseReviews);
    this.router.post(
      `${this.basePath}`,
      authMiddleware,
      validationMiddleware(CreateCourseReviewDto, 'body'),
      this._courseReviewsController.createCourseReview,
    );
    this.router.put(
      `${this.basePath}/:id`,
      authMiddleware,
      validationMiddleware(UpdateCourseReviewDto, 'body'),
      this._courseReviewsController.updateCourseReview,
    );
    this.router.delete(`${this.basePath}/:id`, authMiddleware, this._courseReviewsController.deleteCourseReview);
  }
}

export default CourseReviewsRoutes;
