import { mockToken } from '@/tests/utils';
import { clearDB } from '@/tests/utils';
import CourseProgressRoute from '@/routes/course_progress.route';
import { CourseProgressEntity } from '@/entities/course_progress.entity';
import { CreateCourseDto } from '@/dtos/courses/create_course.dto';
import { CoursesEntity } from '@/entities/courses.entity';
import { mockUserId } from '@/tests/utils';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@databases';

describe('Course Progress', () => {
  let app: App;
  let route: CourseProgressRoute;
  const createCourseDto: CreateCourseDto = {
    title: 'test',
    descriptionRichText: '{}',
    difficulty: 0,
    estimatedTimeOfCompletion: 0,
    tagIds: [],
    codeLessons: [],
  };

  beforeAll(async () => {
    await createConnection(dbConnection);
    route = new CourseProgressRoute();
    app = new App();
    app.init().then(app => {
      app.initializeRoutes([route]);
    });
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe('[GET] /course-progress', () => {
    it('response should have a map of progress for user', async () => {
      const course = await CoursesEntity.create({ ...createCourseDto, authorId: mockUserId }).save();
      await CourseProgressEntity.create({ course: course, userId: mockUserId }).save();

      const response = await request(app.getServer()).get(`${route.basePath}`).set('Authorization', `Bearer ${mockToken}`).expect(200);

      expect(response.body).toHaveProperty(course.id);
    });
  });

  describe('[POST] /course-progress', () => {
    it('should create new course progress', async () => {
      const course = await CoursesEntity.create({ ...createCourseDto, authorId: mockUserId }).save();
      await request(app.getServer())
        .post(`${route.basePath}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ courseId: course.id, userId: mockUserId })
        .expect(200);
    });
  });
});
