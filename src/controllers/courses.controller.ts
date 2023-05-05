import { CourseDto } from '@dtos/courses/course.dto';
import { CreateCourseDto } from '@dtos/courses/create_course.dto';
import { UpdateCourseDto } from '@dtos/courses/update_course.dto';
import { Course } from '@interfaces/course.interface';
import AuthService from '@services/auth.service';
import CoursesService from '@services/courses.service';
import { NextFunction, Request, Response } from 'express';

class CoursesController {
  _coursesService = new CoursesService();
  _authService = new AuthService();

  public getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorId = req.query.authorId ? String(req.query.authorId) : null;
      const courses: CourseDto[] = await this._coursesService.getCourses(authorId);

      res.status(200).json({ data: courses });
    } catch (error) {
      next(error);
    }
  };

  public getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.params.id;
      const course: CourseDto = await this._coursesService.getCourseById(courseId);

      res.status(200).json({ ...course });
    } catch (error) {
      next(error);
    }
  };

  public createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseDto: CreateCourseDto = req.body;
      const { tokenSubject } = await this._authService.getClaims(req);
      const course: Course = await this._coursesService.createCourse(tokenSubject, courseDto);

      res.status(201).json({ ...course });
    } catch (error) {
      next(error);
    }
  };

  public updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseDto: UpdateCourseDto = req.body;
      const courseId = req.params.id;
      const { tokenSubject } = await this._authService.getClaims(req);
      const course: Course = await this._coursesService.updateCourse(courseId, courseDto, tokenSubject);

      res.status(201).json({ ...course });
    } catch (error) {
      next(error);
    }
  };

  public deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.params.id;
      const { tokenSubject } = await this._authService.getClaims(req);
      const course: Course = await this._coursesService.deleteCourse(courseId, tokenSubject);

      res.status(200).json({ data: course });
    } catch (error) {
      next(error);
    }
  };
}

export default CoursesController;
