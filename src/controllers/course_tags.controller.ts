import { CreateCourseTagDto } from '@dtos/course_tags/create_course_tag.dto';
import { CourseTag } from '@interfaces/course_tag.interface';
import CourseTagsService from '@services/course_tags.service';
import { NextFunction, Request, Response } from 'express';

class CourseTagsController {
  private _courseTagsService = new CourseTagsService();

  public getCourseTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseTags: CourseTag[] = await this._courseTagsService.getCourseTags();

      res.status(200).json({ data: courseTags });
    } catch (error) {
      next(error);
    }
  };

  public getCourseTagById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseTagId = req.params.id;
      const courseTag: CourseTag = await this._courseTagsService.getCourseTagById(courseTagId);

      res.status(200).json({ data: courseTag });
    } catch (error) {
      next(error);
    }
  };

  public createCourseTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseTagDto: CreateCourseTagDto = req.body;
      const courseTag: CourseTag = await this._courseTagsService.createCourseTag(courseTagDto);

      res.status(201).json({ data: courseTag });
    } catch (error) {
      next(error);
    }
  };

  public deleteCourseTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.params.id;
      const courseTag: CourseTag = await this._courseTagsService.deleteCourseTag(courseId);

      res.status(200).json({ data: courseTag });
    } catch (error) {
      next(error);
    }
  };
}

export default CourseTagsController;
