import CourseCodeLessonsController from '@controllers/course_code_lessons.controller';
import CoursesController from '@controllers/courses.controller';
import { CreateCourseDto } from '@dtos/courses/create_course.dto';
import { UpdateCourseDto } from '@dtos/courses/update_course.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class CoursesRoutes implements Routes {
  public basePath = '/courses';
  public codeLessonsPath = 'code-lessons';
  public router = Router();
  public coursesController = new CoursesController();
  public courseCodeLessonsController = new CourseCodeLessonsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.basePath}`, authMiddleware, this.coursesController.getCourses);
    this.router.get(`${this.basePath}/:id`, authMiddleware, this.coursesController.getCourseById);
    this.router.post(`${this.basePath}`, authMiddleware, validationMiddleware(CreateCourseDto, 'body'), this.coursesController.createCourse);
    this.router.put(`${this.basePath}/:id`, authMiddleware, validationMiddleware(UpdateCourseDto, 'body'), this.coursesController.updateCourse);
    this.router.delete(`${this.basePath}/:id`, authMiddleware, this.coursesController.deleteCourse);
    this.router.get(
      `${this.basePath}/:courseId/${this.codeLessonsPath}`,
      authMiddleware,
      this.courseCodeLessonsController.getCourseCodeLessonsByCourseId,
    );
    this.router.get(
      `${this.basePath}/:courseId/${this.codeLessonsPath}/:codeLessonId`,
      authMiddleware,
      this.courseCodeLessonsController.getCourseCodeLessonById,
    );
  }
}

export default CoursesRoutes;
