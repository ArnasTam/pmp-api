import CourseTagsController from '@controllers/course_tags.controller';
import { CreateCourseTagDto } from '@dtos/course_tags/create_course_tag.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class CourseTagsRoute implements Routes {
  public path = '/course-tags';
  public router = Router();
  public courseTagsController = new CourseTagsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.courseTagsController.getCourseTags);
    this.router.get(`${this.path}/:id`, authMiddleware, this.courseTagsController.getCourseTagById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateCourseTagDto, 'body'), this.courseTagsController.createCourseTag);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.courseTagsController.deleteCourseTag);
  }
}

export default CourseTagsRoute;
