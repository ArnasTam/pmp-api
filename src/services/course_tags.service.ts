import { CreateCourseTagDto } from '@dtos/course_tags/create_course_tag.dto';
import { CourseTagsEntity } from '@entities/course_tags.entity';
import { HttpException } from '@exceptions/HttpException';
import { CourseTag } from '@interfaces/course_tag.interface';
import { isEmpty } from '@utils/util';

class CourseTagsService {
  public async getCourseTags(): Promise<CourseTag[]> {
    return await CourseTagsEntity.find({ order: { title: 'ASC' } });
  }

  public async getCourseTagById(id: string): Promise<CourseTag> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const tag: CourseTag = await CourseTagsEntity.findOne({ where: { id: id } });
    if (!tag) throw new HttpException(409, 'Course tag with the specified id does not exist');

    return tag;
  }

  public async getCourseTagsByIds(ids: string[]): Promise<CourseTag[]> {
    if (isEmpty(ids)) throw new HttpException(400, 'ids must not be empty');

    const tags: CourseTag[] = await CourseTagsEntity.findByIds(ids);
    if (!tags || !tags.length) throw new HttpException(409, 'Course tags with the specified id does not exist');

    return tags;
  }

  public async createCourseTag(data: CreateCourseTagDto): Promise<CourseTag> {
    return await CourseTagsEntity.create({
      ...data,
    }).save();
  }

  public async deleteCourseTag(id: string): Promise<CourseTag> {
    if (isEmpty(id)) throw new HttpException(400, 'id must not be empty');

    const tag: CourseTag = await CourseTagsEntity.findOne({ where: { id: id } });
    if (!tag) throw new HttpException(409, 'Course tag with the specified id does not exist');

    await CourseTagsEntity.delete({ id: id });
    return tag;
  }
}

export default CourseTagsService;
